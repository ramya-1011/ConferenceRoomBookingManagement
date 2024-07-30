 
import MockAdapter from 'axios-mock-adapter'; 
import commonURL from '../commonURL';
import FloorServices from '../Service/FloorService';

describe('FloorServices', () => {
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

    test('should add a floor', async () => {
        const data = { name: 'Floor 1', siteId: 1 };
        mock.onPost('/floor/add', data).reply(200, { success: true });

        const response = await FloorServices.addFloor(data);
        expect(response.data).toEqual({ success: true });
    });

    test('should delete a floor', async () => {
        const id = 1;
        mock.onDelete(`/floor/force/${id}`).reply(200, { success: true });

        const response = await FloorServices.deleteFloor(id);
        expect(response.data).toEqual({ success: true });
    });

    test('should get a floor by ID', async () => {
        const id = 1;
        const floor = { id, name: 'Floor 1', siteId: 1 };
        mock.onGet(`/floor/byId/${id}`).reply(200, floor);

        const response = await FloorServices.getFloor(id);
        expect(response.data).toEqual(floor);
    });

    test('should load all floors', async () => {
        const floors = [
            { id: 1, name: 'Floor 1', siteId: 1 },
            { id: 2, name: 'Floor 2', siteId: 1 }
        ];
        mock.onGet('floor/getAll').reply(200, floors);

        const response = await FloorServices.loadFloors();
        expect(response.data).toEqual(floors);
    });

    test('should get floors by site ID', async () => {
        const id = 1;
        const floors = [
            { id: 1, name: 'Floor 1', siteId: 1 },
            { id: 2, name: 'Floor 2', siteId: 1 }
        ];
        mock.onGet(`/floor/getBySite/${id}`).reply(200, floors);

        const response = await FloorServices.floorsBySite(id);
        expect(response.data).toEqual(floors);
    });

    test('should get floors by filter', async () => {
        const cityId = 1;
        const siteId = 1;
        const floors = [
            { id: 1, name: 'Floor 1', cityId, siteId },
            { id: 2, name: 'Floor 2', cityId, siteId }
        ];
        mock.onGet(`/floor/filter?cityId=${cityId}&siteId=${siteId}`).reply(200, floors);

        const response = await FloorServices.getFloorsByFilter(cityId, siteId);
        expect(response.data).toEqual(floors);
    });

    test('should update a floor', async () => {
        const id = 1;
        const data = { name: 'Updated Floor 1' };
        mock.onPut(`/floor/update/${id}`, data).reply(200, { success: true });

        const response = await FloorServices.updateFloor(id, data);
        expect(response.data).toEqual({ success: true });
    });
});