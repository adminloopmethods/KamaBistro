const menu = [
    {
        "name": "Chicken Tikka Masala",
        "price": 15.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "traditionalCurries"
    },
    {
        "name": "Lamb Rogan Josh",
        "price": 18.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "traditionalCurries"
    },
    {
        "name": "Paneer Butter Masala",
        "price": 14.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "specialities"
    },
    {
        "name": "Vegetable Biryani",
        "price": 13.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "launch"
    },
    {
        "name": "Tandoori Chicken",
        "price": 16.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorCharcoalGrill"
    },
    {
        "name": "Garlic Naan",
        "price": 3.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorBakedBreads"
    },
    {
        "name": "Samosas",
        "price": 6.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "sides"
    },
    {
        "name": "Butter Chicken",
        "price": 17.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": false,
        "category": "specialities"
    },
    {
        "name": "Aloo Gobi",
        "price": 12.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "dinner"
    },
    {
        "name": "Chicken Curry",
        "price": 14.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "traditionalCurries"
    },
    {
        "name": "Palak Paneer",
        "price": 13.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "specialities"
    },
    {
        "name": "Fish Curry",
        "price": 19.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "traditionalCurries"
    },
    {
        "name": "Chana Masala",
        "price": 11.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "dinner"
    },
    {
        "name": "Seekh Kebab",
        "price": 15.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorCharcoalGrill"
    },
    {
        "name": "Peshwari Naan",
        "price": 4.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorBakedBreads"
    },
    {
        "name": "Cucumber Raita",
        "price": 4.00,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "sides"
    },
    {
        "name": "Dal Makhani",
        "price": 12.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": false,
        "category": "specialities"
    },
    {
        "name": "Chicken Vindaloo",
        "price": 16.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "traditionalCurries"
    },
    {
        "name": "Mutter Paneer",
        "price": 13.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "dinner"
    },
    {
        "name": "Tandoori Prawns",
        "price": 21.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorCharcoalGrill"
    },
    {
        "name": "Keema Naan",
        "price": 5.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorBakedBreads"
    },
    {
        "name": "Onion Bhaji",
        "price": 5.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "sides"
    },
    {
        "name": "Shrimp Korma",
        "price": 20.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "specialities"
    },
    {
        "name": "Baingan Bharta",
        "price": 12.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "dinner"
    },
    {
        "name": "Lamb Kebab",
        "price": 17.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorCharcoalGrill"
    },
    {
        "name": "Cheese Naan",
        "price": 4.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "tandoorBakedBreads"
    },
    {
        "name": "Pappadums",
        "price": 2.99,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "sides"
    },
    {
        "name": "Goat Curry",
        "price": 22.50,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "traditionalCurries"
    },
    {
        "name": "Mango Lassi",
        "price": 5.00,
        "img": "https://media.istockphoto.com/id/1005390222/photo/chicken-tikka-masala-spicy-curry-meat-food-with-rice-and-naan-bread.jpg?s=2048x2048&w=is&k=20&c=JdaN6APes1r2qUyzNYx87yJ14UY5lj-EHBWo3Mk6oic=",
        "active": true,
        "category": "sides"
    }
]

export default menu