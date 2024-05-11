import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import new_collection from '../Assets/new_collections';
import Item from '../Item/Item';
import axios from 'axios';

const NewCollections = () => {
    const [newCollections, setNewCollections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/newcollections');
                setNewCollections(response.data);
            } catch (error) {
                console.error("Error fetching new collections:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='new-collections'>
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {newCollections.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}
            </div>
        </div>
    );
}

export default NewCollections;
