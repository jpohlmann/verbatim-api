import axios from 'axios';

export const postMessageToSlackChannel = async (subject: string, data: object): Promise<void> => {
    await axios.request(
        {
            url: `https://hooks.slack.com/services/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`,
            method: 'POST',
            data: {
                text: `Source: ${subject}\nData: ${JSON.stringify(data)}`
            }
        }
    );
}