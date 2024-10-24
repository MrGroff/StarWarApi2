import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [starships, setStarships] = useState([]);// List of starships
    const [loading, setLoading] = useState(false); // Loading state

    const [selectedStarship, setSelectedStarship] = useState(null); // Currently selected starship
    const [manufacturers, setManufacturers] = useState([]);// List of manufacturers

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
    });/* Initial state for editing a starship */
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
    }); /* Initial state for creating a new starship */
    // eslint-disable-next-line no-unused-vars
    const [retryCount, setRetryCount] = useState(0);  // For tracking retries for starship fetch
    // eslint-disable-next-line no-unused-vars
    const [manufacturerRetryCount, setManufacturerRetryCount] = useState(0); // For tracking retries for manufacturer fetch
    const [searchTerm, setSearchTerm] = useState('');// State for the search input

    const filteredStarships = starships.filter(starship =>
        starship.name.toLowerCase().includes(searchTerm.toLowerCase())
    );// Filtered starships based on search term
    useEffect(() => {
        const fetchDataWithRetry = async () => {
            await fetchStarshipsWithRetry();
            await fetchManufacturersWithRetry();
        };

        fetchDataWithRetry();
    }, []);     // useEffect to fetch data on component mount

    const fetchStarshipsWithRetry = async () => {
        const maxRetries = 5; // Maximum number of retries
        const retryDelay = 3000; // Time (ms) between retries

        const retryFetch = async (attempt = 0) => {
            try {
                await fetchStarships();
            }
            // eslint-disable-next-line no-unused-vars
            catch (error) {
                if (attempt < maxRetries) {
                    setRetryCount(attempt + 1); // Increment retry count
                    console.log(`Retrying starship fetch... attempt ${attempt + 1}`);
                    setTimeout(() => retryFetch(attempt + 1), retryDelay); // Retry after delay
                } else {
                    console.error('Max retries reached for starships. Server might be down.');
                    setLoading(false); // Stop loading after max retries
                }
            }
        };// Function to fetch starships with retry logic

        retryFetch(); // Start retrying
    };

    const fetchManufacturersWithRetry = async () => {
        const maxRetries = 5; // Maximum number of retries
        const retryDelay = 3000; // Time (ms) between retries

        const retryFetch = async (attempt = 0) => {
            try {
                await fetchManufacturers();
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                if (attempt < maxRetries) {
                    setManufacturerRetryCount(attempt + 1); // Increment retry count for manufacturers
                    console.log(`Retrying manufacturers fetch... attempt ${attempt + 1}`);
                    setTimeout(() => retryFetch(attempt + 1), retryDelay); // Retry after delay
                } else {
                    console.error('Max retries reached for manufacturers. Server might be down.');
                    setLoading(false); // Stop loading after max retries
                }
            }
        };

        retryFetch(); // Start retrying
    };// Function to fetch manufacturers with retry logic

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
            throw error; // Rethrow error to trigger retry
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
            throw error; // Rethrow error to trigger retry
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
    // Function to handle form submission for creating/updating starship
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            // Check if we're editing or creating a new starship
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
            window.location.reload();
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
    // Function to set the edit form with the selected starship details
    const handleEdit = (starship) => {
        setEditStarship(starship);
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
    };

    const handleDelete = async (id) => {
        // Optimistically remove the starship from the state
        setStarships(prev => prev.filter(starship => starship.id !== id));

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

            // If delete was successful, refresh the page quietly
            console.log('Starship deleted successfully');
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error deleting starship:', error);

            // Optionally show an error message to the user
            alert('Failed to delete the starship. Please try again.');

            // Since we have optimistically updated, we might want to refresh if needed
            // To ensure the state remains consistent with the server
            // Refresh the page to sync state
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
            <div className="starship-container">
                <h1 id="tableLabel">Random Starship</h1>
                <p>This component demonstrates fetching starship data from the API.</p>

                {loading ? (
                    <p><em>Loading... Please wait.</em></p>
                ) : selectedStarship ? (
                    <div className="starship-details">
                        <h2>{selectedStarship.name}</h2>
                        <p><strong>Model:</strong> {selectedStarship.model}</p>
                        <p><strong>Manufacturer:</strong> {selectedStarship.manufacturer}</p>
                        <p><strong>Cost:</strong> {selectedStarship.costInCredits}</p>
                        <p><strong>Crew:</strong> {selectedStarship.crew}</p>
                        <p><strong>Passengers:</strong> {selectedStarship.passengers}</p>
                        <p><strong>Length:</strong> {selectedStarship.length}</p>
                        <p><strong>Max Speed:</strong> {selectedStarship.maxAtmospheringSpeed}</p>
                    </div>
                ) : (
                    <p>No starships available.</p>
                )}
            </div>

            <div className="form-container">
                <h3>{editStarship.id ? 'Edit Starship' : 'Create Starship'}</h3>
                <form onSubmit={handleSubmit} className="starship-form">
                    <div className="form-group">
                        <h3>Name</h3>
                        <input
                            name="name"
                            placeholder="Name"
                            value={editStarship.id ? editStarship.name : newStarship.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Model</h3>
                        <input
                            name="model"
                            placeholder="Model"
                            value={editStarship.id ? editStarship.model : newStarship.model}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Manufacturer</h3>
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
                    </div>
                    <div className="form-group">
                        <h3>Cost In Credits</h3>
                        <input
                            name="costInCredits"
                            placeholder="Cost in Credits"
                            value={editStarship.id ? editStarship.costInCredits : newStarship.costInCredits}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Cargo Capacity</h3>
                        <input
                            name="cargoCapacity"
                            placeholder="Cargo Capacity"
                            value={editStarship.id ? editStarship.cargoCapacity : newStarship.cargoCapacity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Consumables</h3>
                        <input
                            name="consumables"
                            placeholder="Consumables"
                            value={editStarship.id ? editStarship.consumables : newStarship.consumables}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Crew Size</h3>
                        <input
                            name="crew"
                            placeholder="Crew"
                            value={editStarship.id ? editStarship.crew : newStarship.crew}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Ship Length</h3>
                        <input
                            name="length"
                            placeholder="Length"
                            value={editStarship.id ? editStarship.length : newStarship.length}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Max Atmosphering Speed</h3>
                        <input
                            name="maxAtmospheringSpeed"
                            placeholder="Max Atmosphering Speed"
                            value={editStarship.id ? editStarship.maxAtmospheringSpeed : newStarship.maxAtmospheringSpeed}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Megalight</h3>
                        <input
                            name="mglt"
                            placeholder="MGLT"
                            value={editStarship.id ? editStarship.mglt : newStarship.mglt}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Passengers Size</h3>
                        <input
                            name="passengers"
                            placeholder="Passengers"
                            value={editStarship.id ? editStarship.passengers : newStarship.passengers}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <h3>Hyperdrive Rating</h3>
                        <input
                            name="hyperdriveRating"
                            placeholder="Hyperdrive Rating"
                            value={editStarship.id ? editStarship.hyperdriveRating : newStarship.hyperdriveRating}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <div className="submit-button-container"> {/* Container for the Submit button */}
                            <button type="submit" className="submit-button">
                                {editStarship.id ? 'Update Starship' : 'Create Starship'}
                            </button>
                        </div>
                        <div className="reset-button-container"> {/* Container for the Reset button */}
                            <button type="button" className="reset-button" onClick={resetForm}>
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <h2>Starship List</h2>
            <input
                type="text"
                placeholder="Search by starship name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
                <p><em>Loading starship list...</em></p>
            ) : filteredStarships.length > 0 ? (
                <div className="starship-list">
                    {filteredStarships.map(starship => (
                        <div key={starship.id} className="card">
                            <h3>{starship.name}</h3>
                            <p><strong>Model:</strong> {starship.model}</p>
                            <p><strong>Manufacturer:</strong> {starship.manufacturer}</p>
                            <p><strong>Cost (Credits):</strong> {starship.costInCredits}</p>
                            <div className="button-container">
                                <button onClick={() => handleEdit(starship)}>Edit</button>
                                <button onClick={() => handleDelete(starship.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No starships found.</p>
            )}
        </div>
    );
}

export default App;