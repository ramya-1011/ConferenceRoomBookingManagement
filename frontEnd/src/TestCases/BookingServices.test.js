 
import BookingServices from '../Service/BookingService';
import commonURL from '../commonURL';
// Mock the commonURL module
jest.mock('../commonURL', () => ({
  delete: jest.fn(),
}));



describe('BookingServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a booking by ID', async () => {
    const bookingId = 2;
    const mockResponse = { data: 'Booking deleted successfully' };
    commonURL.delete.mockResolvedValue(mockResponse);

    const response = await BookingServices.deleteBooking(bookingId);
 
    expect(commonURL.delete).toHaveBeenCalledWith(`/booking/cancel/${bookingId}`); 
    expect(response).toEqual(mockResponse);
  });

  test('should handle errors when deleting a booking and an error Occurs', async () => {
    const bookingId = 12;
    const mockError = new Error('Failed to delete booking');
    commonURL.delete.mockRejectedValue(mockError);

    try {
      await BookingServices.deleteBooking(bookingId);
    } catch (error) { 
      expect(error).toEqual(mockError);
    }
 
    expect(commonURL.delete).toHaveBeenCalledWith(`/booking/cancel/${bookingId}`);
  });
});