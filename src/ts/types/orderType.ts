export type orderType = {
    order_id: string,
    cust_reg: boolean,
    reg_cust_id?: string,
    non_reg_cust?: string,
    items: string,
    status: string,
    delivery: string,
    timestamp: Date,
    payment_id: string
}