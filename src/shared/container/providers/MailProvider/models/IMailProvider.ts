import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMailProvider {
  sendEmail(data: ISendMailDTO): Promise<void>;
}

export default IMailProvider;
