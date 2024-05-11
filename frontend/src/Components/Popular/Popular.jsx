import React, { useEffect, useState } from 'react';
import './Popular.css'
import data_product from '../Assets/data'
import Item from '../Item/Item'
import axios from 'axios';

const Popular = () => {

    const [popularproducts, setPopularProducts] = useState([]);
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/popularinwomen');
                setPopularProducts(response.data);
            } catch (error) {
                console.error("Error fetching popular products:", error);
            }
        };
        fetchData();
    },[])

    return (
        <div className='popular'>
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular-item">
                {popularproducts.map((item,i)=>{
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price}   old_price={item.old_price} />
                })}
            </div>
        </div>
    );
}

export default Popular;
