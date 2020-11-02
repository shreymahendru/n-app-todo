export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isDeleted: boolean;
    
    update(name: string, description: string, price: number, image: string): Promise<void>;
    delete(): Promise<void>;
}