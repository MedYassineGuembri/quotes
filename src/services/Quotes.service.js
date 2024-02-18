import axios from 'axios';

class quotesService {
  constructor() {}

  async getRandomQuote() {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }
}

export default quotesService;
