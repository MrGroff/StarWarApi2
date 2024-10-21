import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [starships, setStarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStarship, setSelectedStarship] = useState(null);
    const [manufacturers, setManufacturers] = useState([]);
    const [editStarship, setEditStarship] = useState({
        id: '',
        name: '',
        model: '',
        manufacturer: '',
        costInCredits: '',
        cargoCapacity: '',
        consumables: '',
        crew: '',
        length: '',
        maxAtmospheringSpeed: '',
        mglt: '',
        starshipClass: '',
        passengers: '',
        hyperdriveRating: '',
        films: []
    });
    const [newStarship, setNewStarship] = useState({
        name: '',
        model: '',
        manufacturer: '',
        costInCredits: '',
        cargoCapacity: '',
        consumables: '',
        crew: '',
        length: '',
        maxAtmospheringSpeed: '',
        mglt: '',
        starshipClass: '',
        passengers: '',
        hyperdriveRating: '',
        films: []
    });

    useEffect(() => {
        fetchStarships();
        fetchManufacturers();
    }, []);

    const fetchStarships = async () => {
        setLoading(true);
        try {
            const response = await fetch('/starships/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setStarships(data);
            selectRandomStarship(data);
        } catch (error) {
            console.error('Error fetching starships:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchManufacturers = async () => {
        try {
            const response = await fetch('/starships/manufacturers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setManufacturers(data);
        } catch (error) {
            console.error('Error fetching manufacturers:', error);
        }
    };

    const selectRandomStarship = (starships) => {
        if (starships.length > 0) {
            const randomIndex = Math.floor(Math.random() * starships.length);
            setSelectedStarship(starships[randomIndex]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editStarship.id) {
            setEditStarship(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setNewStarship(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;

            if (editStarship.id) {
                response = await fetch(`/starships/update/${editStarship.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editStarship),
                });
            } else {
                response = await fetch('/starships/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newStarship),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to create/update starship');
            }

            const createdOrUpdatedStarship = await response.json();

            if (editStarship.id) {
                setStarships(prev => prev.map(starship =>
                    (starship.id === createdOrUpdatedStarship.id ? createdOrUpdatedStarship : starship)
                ));
            } else {
                setStarships(prev => [...prev, createdOrUpdatedStarship]);
            }

            resetForm();
            selectRandomStarship([...starships, createdOrUpdatedStarship]);
        } catch (error) {
            console.error('Error creating/updating starship:', error);
        }
    };

    const handleEdit = (starship) => {
        setEditStarship(starship); // Populate the form with the starship data for editing
        setNewStarship({ // Clear newStarship data
            name: '',
            model: '',
            manufacturer: '',
            costInCredits: '',
            cargoCapacity: '',
            consumables: '',
            crew: '',
            length: '',
            maxAtmospheringSpeed: '',
            mglt: '',
            starshipClass: '',
            passengers: '',
            hyperdriveRating: '',
            films: []
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/starships/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete starship');
            }

            setStarships(prev => prev.filter(starship => starship.id !== id));
        } catch (error) {
            console.error('Error deleting starship:', error);
        }
    };

    const resetForm = () => {
        setNewStarship({
            name: '',
            model: '',
            manufacturer: '',
            costInCredits: '',
            cargoCapacity: '',
            consumables: '',
            crew: '',
            length: '',
            maxAtmospheringSpeed: '',
            mglt: '',
            starshipClass: '',
            passengers: '',
            hyperdriveRating: '',
            films: []
        });
        setEditStarship({
            id: '',
            name: '',
            model: '',
            manufacturer: '',
            costInCredits: '',
            cargoCapacity: '',
            consumables: '',
            crew: '',
            length: '',
            maxAtmospheringSpeed: '',
            mglt: '',
            starshipClass: '',
            passengers: '',
            hyperdriveRating: '',
            films: []
        });
    };

    return (
        <div>
            <h1 id="tableLabel">Random Starship</h1>
            <p>This component demonstrates fetching starship data from the API.</p>
            {loading ? (
                <p><em>Loading... Please wait.</em></p>
            ) : selectedStarship ? (
                <div>
                    <h2>{selectedStarship.name}</h2>
                    <p>Model: {selectedStarship.model}</p>
                    <p>Manufacturer: {selectedStarship.manufacturer}</p>
                    <p>Cost: {selectedStarship.costInCredits}</p>
                    <p>Crew: {selectedStarship.crew}</p>
                    <p>Passengers: {selectedStarship.passengers}</p>
                    <p>Length: {selectedStarship.length}</p>
                    <p>Max Speed: {selectedStarship.maxAtmospheringSpeed}</p>
                </div>
            ) : (
                <p>No starships available.</p>
            )}

            <div className="form-container">
                <h2>{editStarship.id ? 'Edit Starship' : 'Create Starship'}</h2>
                <form onSubmit={handleSubmit} className="starship-form">
                    <input
                        name="name"
                        placeholder="Name"
                        value={editStarship.id ? editStarship.name : newStarship.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="model"
                        placeholder="Model"
                        value={editStarship.id ? editStarship.model : newStarship.model}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="manufacturer"
                        value={editStarship.id ? editStarship.manufacturer : newStarship.manufacturer}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select Manufacturer</option>
                        {manufacturers.map(manufacturer => (
                            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                        ))}
                    </select>
                    <input
                        name="costInCredits"
                        placeholder="Cost in Credits"
                        value={editStarship.id ? editStarship.costInCredits : newStarship.costInCredits}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="cargoCapacity"
                        placeholder="Cargo Capacity"
                        value={editStarship.id ? editStarship.cargoCapacity : newStarship.cargoCapacity}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="consumables"
                        placeholder="Consumables"
                        value={editStarship.id ? editStarship.consumables : newStarship.consumables}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="crew"
                        placeholder="Crew"
                        value={editStarship.id ? editStarship.crew : newStarship.crew}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="length"
                        placeholder="Length"
                        value={editStarship.id ? editStarship.length : newStarship.length}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="maxAtmospheringSpeed"
                        placeholder="Max Atmosphering Speed"
                        value={editStarship.id ? editStarship.maxAtmospheringSpeed : newStarship.maxAtmospheringSpeed}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="MGLT"
                        placeholder="MGLT"
                        value={editStarship.id ? editStarship.mglt : newStarship.mglt}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="passengers"
                        placeholder="Passengers"
                        value={editStarship.id ? editStarship.passengers : newStarship.passengers}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="hyperdriveRating"
                        placeholder="Hyperdrive Rating"
                        value={editStarship.id ? editStarship.hyperdriveRating : newStarship.hyperdriveRating}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="button-group">
                        <button type="submit" className="submit-button">
                            {editStarship.id ? 'Update Starship' : 'Create Starship'}
                        </button>
                        <button type="button" className="reset-button" onClick={resetForm}>Reset</button>
                    </div>
                </form>
            </div>

            <h2>Starship List</h2>
            {loading ? (
                <p><em>Loading starship list...</em></p>
            ) : starships.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Model</th>
                            <th>Manufacturer</th>
                            <th>Cost (Credits)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {starships.map(starship => (
                            <tr key={starship.id}>
                                <td>{starship.name}</td>
                                <td>{starship.model}</td>
                                <td>{starship.manufacturer}</td>
                                <td>{starship.costInCredits}</td>
                                <td>
                                    <button onClick={() => handleEdit(starship)}>Edit</button>
                                    <button onClick={() => handleDelete(starship.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No starships found in the list.</p>
            )}
        </div>
    );
}

export default App;
