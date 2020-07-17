import * as uuid from 'uuid';
export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export interface IBasket {
    id: string;
    items: IBasketItem[];
}


export class Basket implements IBasket{
    id: string;
    items: IBasketItem[];
    /**
     *
     */
    constructor() {
        this.id = uuid.v4();
        this.items = [];
    }
}
export interface IBasketTotals{
    shipping: number;
    subtotal: number;
    total: number;
}