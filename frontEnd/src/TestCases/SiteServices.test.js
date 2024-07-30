 
import MockAdapter from 'axios-mock-adapter'; 
import commonURL from '../commonURL';
import SiteServices from '../Service/SiteService';

describe('SiteServices', () => {
    let mock;

    beforeAll(() => {
        // Initialize the mock adapter for axios
        mock = new MockAdapter(commonURL);
    });

    afterEach(() => {
        // Reset the mock after each test to ensure a clean state
        mock.reset();
    });

    afterAll(() => {
        // Restore the original adapter
        mock.restore();
    });

    test('should add a site', async () => {
        const data = { name: 'Site 1', cityId: 1 };
        const mockResponse = { success: true };
        mock.onPost('/site/add-site', data).reply(200, mockResponse);

        const response = await SiteServices.addSite(data);
        expect(response.data).toEqual(mockResponse);
    });

    test('should delete a site', async () => {
        const id = 1;
        const mockResponse = { success: true };
        mock.onDelete(`/site/force/${id}`).reply(200, mockResponse);

        const response = await SiteServices.deleteSite(id);
        expect(response.data).toEqual(mockResponse);
    });

    test('should get a site by ID', async () => {
        const id = 1;
        const site = { id, name: 'Site 1', cityId: 1 };
        mock.onGet(`/site/byId/${id}`).reply(200, site);

        const response = await SiteServices.getSite(id);
        expect(response.data).toEqual(site);
    });

    test('should load all sites', async () => {
        const sites = [
            { id: 1, name: 'Site 1', cityId: 1 },
            { id: 2, name: 'Site 2', cityId: 1 }
        ];
        mock.onGet('site/sitesList').reply(200, sites);

        const response = await SiteServices.loadSites();
        expect(response.data).toEqual(sites);
    });

    test('should update a site', async () => {
        const id = 1;
        const data = { name: 'Updated Site 1', cityId: 1 };
        const mockResponse = { success: true };
        mock.onPut(`/site/update/${id}`, data).reply(200, mockResponse);

        const response = await SiteServices.updateSite(id, data);
        expect(response.data).toEqual(mockResponse);
    });

    test('should get sites in a location', async () => {
        const locationId = 1;
        const sites = [
            { id: 1, name: 'Site 1', cityId: locationId },
            { id: 2, name: 'Site 2', cityId: locationId }
        ];
        mock.onGet(`/site/byLocation/${locationId}`).reply(200, sites);

        const response = await SiteServices.sitesInLocation(locationId);
        expect(response.data).toEqual(sites);
    });

    test('should get sites using pagination', async () => {
        const params = { page: 1, size: 10 };
        const paginatedSites = {
            content: [
                { id: 1, name: 'Site 1', cityId: 1 },
                { id: 2, name: 'Site 2', cityId: 2 }
            ],
            totalPages: 1,
            totalElements: 2
        };
        mock.onGet('/site/pagination', { params }).reply(200, paginatedSites);

        const response = await  SiteServices.sitesUsingPagination(params);
        expect(response.data).toEqual(paginatedSites);
    });
});