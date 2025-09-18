import Image from "next/image";

interface MenuItem {
    name: string;
    price: number;
    img: string;
    active: boolean;
    category: string;
}

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center hover:shadow-lg transition">
            <div className="w-full h-40 relative mb-3">
                <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl"
                />
            </div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
        </div>
    );
};

export default MenuCard