import Tool from './components/Tool';

Nova.booting((Vue, router, store) => {
    Vue.component('resource-table', Tool);
});