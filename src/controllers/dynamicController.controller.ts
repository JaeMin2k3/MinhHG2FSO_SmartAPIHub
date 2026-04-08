import {Response, Request, NextFunction } from 'express';
import {getTableName} from '../utils/getTableName'
import {db} from '../db/knex'
import {handleExpand} from '../utils/handleExpand'
import {handleEmbed} from '../utils/handleEmbed'
// --- GET DYNAMIC (Lọc, Phân trang, Tìm kiếm) ---
export async function getDynamic(req: Request, res: Response, next: NextFunction) {
    try {
        const tableName = getTableName(req.params.resource as string);
        let query = db(tableName);

        // 1. Tách _expand và _embed ra khỏi req.query
        const { _fields, _page = '1', _limit = '10', _sort, _order = 'asc', q, _expand, _embed, ...filters } = req.query;

        // 2. Select fields
        if (_fields && typeof _fields === 'string') {
            query.select(_fields.split(','));
        } else {
            query.select('*');
        }

        // 3. Filtering (_gte, _lte, _ne, _like)
        for (const [key, value] of Object.entries(filters)) {
            if (typeof value !== 'string') continue;

            if (key.endsWith('_gte')) query.where(key.replace('_gte', ''), '>=', value);
            else if (key.endsWith('_lte')) query.where(key.replace('_lte', ''), '<=', value);
            else if (key.endsWith('_ne')) query.where(key.replace('_ne', ''), '!=', value);
            else if (key.endsWith('_like')) query.where(key.replace('_like', ''), 'like', `%${value}%`);
            else query.where(key, value);
        }

        // 4. Search (q) - Tìm kiếm text
        if (q && typeof q === 'string') {
            query.where((builder) => {
                builder.orWhere('name', 'like', `%${q}%`); 
            });
        }

        // 5. Sorting
        if (_sort && typeof _sort === 'string') {
            query.orderBy(_sort, _order as 'asc' | 'desc');
        }

        // 6. Pagination & Đếm tổng
        const countQuery = query.clone().clearSelect().clearOrder().count('* as total').first();
        
        const page = parseInt(_page as string, 10);
        const limit = parseInt(_limit as string, 10);
        const offset = (page - 1) * limit;
        query.limit(limit).offset(offset);

        // 7. Thực thi truy vấn gốc
        const [data, totalResult] = await Promise.all([query, countQuery]);

        // 8. XỬ LÝ RELATIONSHIPS (Dữ liệu cha / Dữ liệu con)
        let finalData = data;

        if (_expand && typeof _expand === 'string') {
            finalData = await handleExpand(finalData, _expand);
        }

        if (_embed && typeof _embed === 'string') {
            finalData = await handleEmbed(finalData, tableName, _embed);
        }

        // 9. Trả kết quả
        res.setHeader('X-Total-Count', totalResult?.total as number || 0);
        return res.status(200).json({ message: "success", data: finalData });

    } catch (error: any) {
        if (error.message === "Resource không hợp lệ") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
}

// --- POST DYNAMIC (Tạo mới) ---
export async function createDynamic(req: Request, res: Response, next: NextFunction) {
    try {
        const tableName = getTableName(req.params.resource as string);
        const payload = req.body;
        
        payload.created_at = new Date();
        payload.updated_at = new Date();

        const [id] = await db(tableName).insert(payload);
        return res.status(201).json({ message: "success", data: { id, ...payload } });
    } catch (error) {
        next(error);
    }
}

// --- PATCH DYNAMIC (Cập nhật một phần) ---
export async function updateDynamic(req: Request, res: Response, next: NextFunction) {
    try {
        const tableName = getTableName(req.params.resource as string);
        const payload = req.body;
        
        payload.updated_at = new Date();

        const updatedRows = await db(tableName).where({ id: req.params.id }).update(payload);
        if (updatedRows === 0) return res.status(404).json({ message: "Không tìm thấy record" });

        return res.status(200).json({ message: "success", data: payload });
    } catch (error) {
        next(error);
    }
}

// --- DELETE DYNAMIC ---
export async function deleteDynamic(req: Request, res: Response, next: NextFunction) {
    try {
        const tableName = getTableName(req.params.resource as string);
        const deletedRows = await db(tableName).where({ id: req.params.id }).del();
        
        if (deletedRows === 0) return res.status(404).json({ message: "Không tìm thấy record" });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}
