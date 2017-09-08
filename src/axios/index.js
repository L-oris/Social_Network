//set csrf protection on HTTP Header of each ajax request made using axios
//now inside react components instead of importing 'axios' module we'll import this instance, like '../axios'
import axios from 'axios'

const instance = axios.create({
  xsrfCookieName: 'csrf-token-cookie',
  xsrfHeaderName: 'csrf-token'
})

export default instance
