import React,{ useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import logo from '../../assets/logo.svg';

import './styles.css'

import api from '../../services/api';
//import { fakeapiUfs, fakeapiCities } from '../../services/fakeapi';

interface Item {
    id: number,
    title: string,
    image_url: string
}
interface Uf {
    id: number,
    sigla: string,
    nome: string
}
interface Cities {
    id: number,
    nome: string
}

const CreatePoint = () => {
    const [items,setItems] = useState<Item[]>([]);
    const [ufs,setUfs] = useState<Uf[]>([]);
    const [cities,setCities] = useState<Cities[]>([]);

    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);
    const [selectedUf,setSelectedUf] = useState('0');
    const [selectedCity,setSelectedCity] = useState('0');
    const [selectedItems,setSelectedItems] = useState<number[]>([]);

    const [currentPosition, setCurrentPosition] = useState<[number,number]>([0,0]);
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const history = useHistory();
    
    async function handleUfs(event: ChangeEvent<HTMLSelectElement>){
         setSelectedUf(event.target.value);
    }
    function handleCities(event: ChangeEvent<HTMLSelectElement>){
        setSelectedCity(event.target.value);
    }
    async function loadUfs(){
        try {
            const response = await axios.get('http://localhost:5000/api/v1/estados');

            setUfs(response.data);
        } catch (error) {

            if(error.response){
                console.log(error.response);
            }
        }
    }
    async function loadCities(uf: string){
        try {
            if(uf !== '0'){
                const response = await axios.get(`http://localhost:5000/api/v1/cidades/${uf}`);

                setCities(response.data);
            }
            
        } catch (error) {

            if(error.response){
                console.log(error.response);
            }
        }
    }
    useEffect(()=> {
       /* fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            setUfs(data)
        }) */
        loadUfs();
    },[]);

    useEffect(()=> {
       /* fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            setCities(data);
        }) */
    loadCities(selectedUf);

    },[selectedUf]);
    
    useEffect(()=> {
            api.get('/items').then(response => {
                setItems(response.data);
            });
            loadInitialPosition();
    },[]);

    function handleMapClick(event: LeafletMouseEvent){
        console.log(event.latlng);
        const { lat, lng } = event.latlng;

        setSelectedPosition([lat,lng]);
    }
    function loadInitialPosition(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=> {
                const { latitude, longitude } = position.coords;

                 setCurrentPosition([latitude,longitude]);
                 //console.log(position.coords);
            });
        }
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value }  = event.target;
         
        setFormData({...formData,[name]: value});

        console.log(formData);

    }
    function handleSelectItem(id: number){
        if(selectedItems.includes(id)){
            setSelectedItems(prev => prev.filter(item => item !== id));
        }else{
            setSelectedItems([...selectedItems,id]);
        }
        
    }
    async function handleSubmit(event: FormEvent){
       event.preventDefault();
       const [latitude,longitude] = selectedPosition;
       if(latitude === 0 && longitude === 0){
           alert("Selecione um posição no mapa");
           return;
       }
       const { name, email, whatsapp } = formData;
       
       const city = selectedCity;
       const uf = selectedUf;
       const items = selectedItems;

       console.log(latitude, longitude);

      const data = {
             name,
             email,
             whatsapp,
             latitude,
             longitude,
             uf,
             city,
             items
          }
          console.log(data);

         try {
             await api.post('/points', data);

             alert('Registrado com sucesso')

             history.push('/');
         } catch (error) {
             
         }
    }
     return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link  to="/" >
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                           type="text"
                           name="name"
                           id="name"
                           onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={currentPosition} zoom={15} onClick={handleMapClick}>
                       <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleUfs} >
                            <option value="0">Selecione uma UF</option>
                                {ufs.map(item => {
                                    return <option key={item.id} value={item.sigla} >{item.sigla}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade </label>
                            <select name="city" id="city" value={selectedCity} onChange={handleCities} >
                            <option value="0">Selecione uma cidade</option>
                                {cities.map(item => {
                                    return <option key={item.id} value={item.nome} >{item.nome}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Items de Coleta</h2>
                        <span>Selection um o mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                       {items.map(item => {                  
                    return <li  
                            key={item.id}
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected': ''}
                           >
                              <img src={item.image_url} alt={item.title}/>
                               <span>{item.title}</span>
                           </li>
                       })}
                    </ul>
                </fieldset>
                <button type="submit" >
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
     )
}

export default CreatePoint;