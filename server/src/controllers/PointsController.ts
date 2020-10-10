import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(req: Request, res: Response){
        const { city, uf, items } = req.query;

        //console.log(city, uf, items);

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points') // select the table points and
           .join('point_items', 'points.id', '=', 'point_items.point_id') // join the tables points and point_items 
           .whereIn('point_items.item_id', parsedItems) // conditions if the point_items.item_id have one of the values the the array parsedtItems
           .where('city', String(city)) // condition city is equal city query
           .where('uf', String(uf)) // condition uf is equal uf query
           .distinct() // distinct point fro not repeat the points
           .select('points.*'); // select all points

        return res.status(200).json(points);
    }
    async show(req: Request, res: Response){
        const { id } = req.params;

        const point = await knex('points').where('id',id).first();

        if(!point){
            return res.status(400).json({message: "Point Not Found"});
        }
        // query
        /*
         SELECT * FROM items
         JOIN point_items ON items.id = point_items.items_id
         WHERE point_items.point_id = {id}
        */
        const items = await knex('items')
        .join('point_items', "items.id", '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');

        return res.status(200).json({point, items});
    }
    async create(req: Request,res: Response){
        const { 
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
           } = req.body;
   const trx = await knex.transaction();
       // INSERT INTO points VALUES (values,...);
       const points = {
        image: 'image-test',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
       }
   const points_ids = await trx("points").insert(points)
   
       const pointItems = items.map((item_id: number) => {
           return {
               item_id,
               point_id: points_ids[0]
           }
       })
   
       await trx('point_items').insert(pointItems);

       await trx.commit();
       
       return res.json({id: points_ids[0], ...points});
    }
}

export default new PointsController();