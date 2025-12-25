export default {
    onBeforeUnmount() {
        localStorage.removeItem('token');
        localStorage.removeItem('client_id');
        localStorage.removeItem('role');
        console.log('Token and role have been removed from localStorage');
    },
};
