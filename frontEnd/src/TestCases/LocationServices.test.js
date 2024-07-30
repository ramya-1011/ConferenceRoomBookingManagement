 
import MockAdapter from 'axios-mock-adapter'; 
import commonURL from '../commonURL';
import LocationServices from '../Service/LocationService';

describe('LocationServices', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(commonURL);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    test('should add a location', async () => {
        const data = { name: 'Location 1', state: 'State 1' };
        const mockResponse = { success: true };
        mock.onPost('/cities/add-city', data).reply(200, mockResponse);

        const response = await  LocationServices.addLocation(data);
        expect(response.data).toEqual(mockResponse);
    });

    test('should delete a location', async () => {
        const id = 1;
        const mockResponse = { success: true };
        mock.onDelete(`/cities/force/${id}`).reply(200, mockResponse);

        const response = await LocationServices.forceDeleteLocation(id);
        expect(response.data).toEqual(mockResponse);
    });

    test('should get a location by ID', async () => {
        const id = 1;
        const location = { id, name: 'Location 1', state: 'State 1' };
        mock.onGet(`/cities/byId/${id}`).reply(200, location);

        const response = await LocationServices.getLocation(id);
        expect(response.data).toEqual(location);
    });

    test('should load all locations', async () => {
        const locations = [
            { id: 1, name: 'Location 1', state: 'State 1' },
            { id: 2, name: 'Location 2', state: 'State 2' }
        ];
        mock.onGet('cities/citiesList').reply(200, locations);

        const response = await LocationServices.loadLocations();
        expect(response.data).toEqual(locations);
    });

    test('should update a location', async () => {
        const id = 1;
        const data = { name: 'Updated Location 1', state: 'Updated State 1' };
        const mockResponse = { success: true };
        mock.onPut(`/cities/update/${id}`, data).reply(200, mockResponse);

        const response = await LocationServices.updateLocation(id, data);
        expect(response.data).toEqual(mockResponse);
    });
});