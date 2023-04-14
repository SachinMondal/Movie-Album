import React, { useEffect, useState } from 'react';
import UpdateForm from './UpdateForm';
import AddMovie from './AddMovie';
import Loader from './Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


const Index = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);

    const fetchAllAlbums = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/albums');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error('Error fetching albums:', error);
        }
        setLoading(false);
        setDataFetched(true);
    };


    useEffect(() => {
        fetchAllAlbums();
    }, []);

    const fetchUpdateAlbum = (albumData) => {
        fetch('https://jsonplaceholder.typicode.com/albums', {
            method: 'POST',
            body: JSON.stringify(albumData),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setData([json, ...data]);
                setTimeout(() => {
                    NotificationManager.success('Album added successfully', 'Success');
                }, 1000);
            });
    };


    const addNewAlbum = (title, userId) => {
        const albumData = {
            title,
            userId,
        };
        fetchUpdateAlbum(albumData);
    };

    const handleDeleteAlbumUpdate = (id) => {
        fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
            method: 'DELETE',
        }).then(() => {
            setData(data.filter((item) => item.id !== id));
            setTimeout(() => {
                NotificationManager.success('Album deleted successfully', 'Success');
            }, 1000);
        });
    };

    const updateAlbum = (albumId, albumData, item) => {
        fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
            method: 'PUT',
            body: JSON.stringify(albumData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((updatedAlbum) => {
                // Update the state with the updated album
                setData(data.map((album) => album.id === albumId ? updatedAlbum : album));
                console.log(updatedAlbum);
            })
            .catch((error) => {
                console.error('Error updating album:', error);
            });
    };
    const handleMouseIn = (id) => {
        document.getElementById(`deleteicon${id}`).classList.add("fa-bounce");
    };

    const handleMouseOut = (id) => {
        document.getElementById(`deleteicon${id}`).classList.remove("fa-bounce");
    };

    return (
        <div>
            <NotificationContainer />
            <ul>
                <div>
                    <AddMovie addNewAlbum={addNewAlbum} />
                </div>
                {loading && !dataFetched && <Loader />}
                {!loading && data.map((item) => (
                    <div
                        className='card d-inline-flex p-2 m-4 shadow p-3 mb-5 bg-body-tertiary rounded bg-info-subtle'
                        key={item.id}
                    >
                        <img
                            src='https://www.filmmusicsite.com/images/covers/large/3130.jpg'
                            className='card-img-top'
                            alt='...'
                        />
                        <div className='card-body'>
                            <p className='card-text'>{item.title}</p>
                        </div>
                        <div className="button-container">
                            <button className='btn btn-' id="delete" style={{
                                'width': '40px',
                                'height': '38px',
                                'marginRight': '4px'
                            }} onMouseEnter={() => handleMouseIn(item.id)}
                                onMouseLeave={() => handleMouseOut(item.id)} onClick={() => handleDeleteAlbumUpdate(item.id)}>
                                <i id={`deleteicon${item.id}`} className='fa-solid fa-trash'></i>
                            </button>
                            <br />
                            <div key={item.id}>
                                <UpdateForm updateAlbum={updateAlbum} item={item} id={item.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Index;
