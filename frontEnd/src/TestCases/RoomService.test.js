 
import MockAdapter from 'axios-mock-adapter'; 
import commonURL from '../commonURL';
import RoomServices from '../Service/RoomService';

describe('RoomServices', () => {
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

    test('should add a room', async () => {
        const data = { name: 'Room 1', type: 'Conference' };
        const mockResponse = { success: true };
        mock.onPost('/rooms/add-room', data).reply(200, mockResponse);

        const response = await RoomServices.addRoom(data);
        expect(response.data).toEqual(mockResponse);
    });

    test('should add a booking', async () => {
        const data = { roomId: 1,   date: '2024-08-01', employeeName: 'ramya' };
        const mockResponse = { success: true };
        mock.onPost('/booking/book-room', data).reply(200, mockResponse);

        const response = await RoomServices.addBooking(data);
        expect(response.data).toEqual(mockResponse);
    });

    test('should delete a room', async () => {
        const id = 1;
        const mockResponse = { success: true };
        mock.onDelete(`/rooms/delete/${id}`).reply(200, mockResponse);

        const response = await RoomServices.deleteRoom(id);
        expect(response.data).toEqual(mockResponse);
    });

    test('should get a room by ID', async () => {
        const id = 1;
        const room = { id, name: 'Room 1', type: 'Conference' };
        mock.onGet(`/rooms/room-by-id/${id}`).reply(200, room);

        const response = await RoomServices.getRoom(id);
        expect(response.data).toEqual(room);
    });

    test('should get all rooms', async () => {
        const rooms = [
            { id: 1, name: 'Room 1', type: 'Conference' },
            { id: 2, name: 'Room 2', type: 'Meeting' }
        ];
        mock.onGet('/rooms/allRooms').reply(200, rooms);

        const response = await RoomServices.getAllRooms();
        expect(response.data).toEqual(rooms);
    });

    test('should update a room', async () => {
        const id = 1;
        const data = { name: 'Updated Room 1', type: 'Conference' };
        const mockResponse = { success: true };
        mock.onPut(`/rooms/update/${id}`, data).reply(200, mockResponse);

        const response = await RoomServices.updateRoom(id, data);
        expect(response.data).toEqual(mockResponse);
    });

    test('should get rooms by filter', async () => {
        const cityId = 1;
        const siteId = 1;
        const floorId = 1;
        const rooms = [
            { id: 1, name: 'Room 1', type: 'Conference', cityId, siteId, floorId },
            { id: 2, name: 'Room 2', type: 'Meeting', cityId, siteId, floorId }
        ];
        mock.onGet(`/rooms/filter?cityId=${cityId}&siteId=${siteId}&floorId=${floorId}`).reply(200, rooms);

        const response = await RoomServices.getRoomsByFilter(cityId, siteId, floorId);
        expect(response.data).toEqual(rooms);
    });
});