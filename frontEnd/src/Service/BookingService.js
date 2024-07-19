import commonURL from "../commonURL";



const deleteBooking = (bookingId) => {
    return commonURL.delete(`/booking/cancel/${bookingId}`);
};
const BookingServices={
    deleteBooking,
}
export default BookingServices;