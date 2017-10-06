import {HttpClient} from '../src/httpClientHelper'

let client = new HttpClient('http://localhost:8080', {
    defaultMessages: {error: {title: '111', message: 'fsfdfs'}, success: {title: 'fdf', message: 'fsfdfs'}}
});
client.addEventListener('busy', isBusy => {
    console.log(isBusy);
});
client.addEventListener('success', (message, response) => {
    console.log(message, response);
});
client.addEventListener('error', (message, response) => {
    console.log(message, response);
});
client.get('/api/myUrl1').then(i => {
    console.log(i);
});

client.get('/api/myUrl2', {param1: 'paramddd2'});
console.log(client.activeRequests);

client.get('/api/myUrl3', {param1: 'paramddd2'}, {
    messages: {
        error: {title: 'ok', message: 'Custom ok'},
        success: {title: 'bad', message: 'Custom fail'}
    }
});
console.log(client.activeRequests);

client.post('/api/myUrl4', {param1: 'paramddd2'});

client.put('/api/myUrl5', {param1: 'paramddd2'});

client.postForm('/api/myUrl6', {param1: 'paramddd2'});