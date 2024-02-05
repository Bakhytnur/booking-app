import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav.jsx";

export default function PlacesFormPage() {
    const {id} = useParams();

    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState(''); 
    const [maxGuests,setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.addedPhotos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
        });
    }, [id]);
    function inputHeader(text) {
        return <h2 className="text-2xl mt-4">{text}</h2>
    }

    function inputDescription(text) {
        return <p className="text-gray-500 text-sm">{text}</p>
    }

    function preInput(header,description) {
        return (
            <>
              {inputHeader(header)}
              {inputDescription(description)}
            </>
        );
    }

    async function addNewPlace(e) {
        e.preventDefault();
        await axios.post('/places', {
            title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests
        });
        setRedirect(true);
    }

    if(redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
            <div>
                <AccountNav />
                <form onSubmit={addNewPlace}>
                    {preInput('Title', 'Title for your place')}
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="title" />
                    {preInput('Address', 'Address to this place')}
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="address" />
                    <h2 className="text-2xl mt-4">Photos</h2>
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                    {preInput('Description', 'description of the place')}
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                    {preInput('Perks', 'select all the perks of your place')}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks} />
                    </div>
                    {preInput('Extra info', 'house rules, etc')}
                    <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                    {preInput('Check in&out times', 'add check in and out times, remember to have some time window for cleaning')}
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mt-2 -mb-1">Check in time</h3>
                            <input type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="14" />
                        </div>

                        <div>
                            <h3 className="mt-2 -mb-1">Check out time</h3>
                            <input type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder="11"/>
                        </div>

                        <div>
                            <h3 className="mt-2 -mb-1">Max number of guests</h3>
                            <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
                        </div>
                    </div>
                    <button className="primary my-4">Save</button>
                </form>
            </div> 
    );
}