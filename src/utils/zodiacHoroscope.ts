import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import moment from 'moment';
import Creds from '../../biidev.json';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: Creds.client_email,
  key: Creds.private_key,
  scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(
  '1Oahej8yuEHfDsQI-AwycEpQ0CnjkMsxOMg2ywMKnjsg',
  jwt,
);

export const zodiacGenerate = async (birthday: string): Promise<string> => {
  try {
    await doc.loadInfo();
    let result: string;
    const sheet = doc.sheetsByIndex[1];
    const cellA1 = await sheet.getCellsInRange('A1:C112');
    if (Array.isArray(cellA1)) {
      cellA1.forEach((value) => {
        const checkDate = moment(birthday, 'YYYY-MM-DD');
        const startDate = moment(value[0], 'YYYY MMMM DD');
        const endDate = moment(value[1], 'YYYY MMMM DD');
        if (checkDate.isBetween(startDate, endDate)) {
          result = value[2];
        }
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const horoscopeGenerate = async (birthday: string): Promise<string> => {
  try {
    await doc.loadInfo();
    let result: string;
    const sheet = doc.sheetsByIndex[0];
    const cellA1 = await sheet.getCellsInRange('A1:A23');
    cellA1.forEach((value) => {
      if (value.length > 0) {
        const cellSplit = value[0].split(':');
        const splitStart = cellSplit[0].split(' ');
        const splitDate = cellSplit[1].split('–');
        const checkDate = moment(birthday, 'YYYY-MM-DD').year(2025);
        const startDate = moment(splitDate[0].trim(), 'MMMM DD').year(2025);
        const endDate = moment(splitDate[1].trim(), 'MMMM DD').year(2025);
        if (checkDate.isBetween(startDate, endDate)) {
          result = splitStart[1];
        }
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
};
