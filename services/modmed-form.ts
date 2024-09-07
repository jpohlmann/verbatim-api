import { AuthCookies, DiagnosisRequest, DiagnosisResponse} from '../types/modmed-ui';
import axios from 'axios';

const qs = require('qs');

const getSessionCookies = async (): Promise<any> => {
    const response = await axios({
        method: 'get',
        url: 'https://verbatimaisandbox.m2integrationtest.com/ema/ProviderLogin.action'
    });
    
    return parseCookiesFromHeaders(response.headers);
}
export const login = async (username: string, password: string, providerUrl: string): Promise<AuthCookies> => {
    try {
        const getCookies = await getSessionCookies();
        const response = await axios({
            method: 'post',
            url: 'https://verbatimaisandbox.m2integrationtest.com/ema/provider-login',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Origin': 'https://verbatimaisandbox.m2integrationtest.com',
              'Pragma': 'no-cache',
              'Referer': 'https://verbatimaisandbox.m2integrationtest.com/ema/ProviderLogin.action',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': '?1',
              'Cookie': `gdpr.attempt=provider; JSESSIONID=${getCookies['JSESSIONID']}; CSID=${getCookies['CSID']}`, 
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"'
            },
            data: qs.stringify({
              targetUrl: '',
              username: 'dcane',
              password: 'Password1234',
              login: ''
            }),
            withCredentials: true
          });

    // Return cookie values
    return {
        csid: getCookies['CSID'] || null,
        jsessionid: getCookies['JSESSIONID'] || null,
        gdpr: 'provider'
    };
  } catch (error) {
    console.error('Error during login:', error);
  }
}

export const sendDiagnosisRequest = async (providerUrl: string, authCookies: AuthCookies, diagnosis: DiagnosisRequest): Promise<DiagnosisResponse> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${providerUrl}/ema/ws/v3/visitDiagnosis/with-plan-defaults`,
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Content-Type': 'application/json',
              'Origin': providerUrl,
              'Pragma': 'no-cache',
              'Referer': `${providerUrl}/ema/web/practice/staff`,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"',
              'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
            },
            data: diagnosis
          });
        return response.data;
    } catch (error) {
        console.error('Error making request:', error);
    }
}

// Extract cookies from the response headers
const parseCookiesFromHeaders = (headers) => {
    const setCookieHeader = headers['set-cookie'];
    let cookies = {};

    if (setCookieHeader) {
        setCookieHeader.forEach(cookie => {
        const cookieParts = cookie.split(';')[0].split('=');
        cookies[cookieParts[0]] = cookieParts[1];
        });
    }
    return cookies;
}