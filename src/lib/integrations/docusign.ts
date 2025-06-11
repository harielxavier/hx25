import { createClient } from 'docusign-esign';

export interface DocusignConfig {
  accessToken: string;
  accountId: string;
  basePath: string;
}

export class ContractManager {
  private client: any;

  constructor(config: DocusignConfig) {
    this.client = new createClient({
      basePath: config.basePath,
      accessToken: config.accessToken
    });
  }

  async createEnvelope(contractData: {
    documentBase64: string;
    signerEmail: string;
    signerName: string;
    contractName: string;
  }) {
    const envelope = {
      emailSubject: `Photography Contract - ${contractData.contractName}`,
      documents: [{
        documentBase64: contractData.documentBase64,
        name: contractData.contractName,
        fileExtension: 'pdf',
        documentId: '1'
      }],
      recipients: {
        signers: [{
          email: contractData.signerEmail,
          name: contractData.signerName,
          recipientId: '1',
          tabs: {
            signHereTabs: [{
              xPosition: '100',
              yPosition: '100',
              documentId: '1',
              pageNumber: '1'
            }]
          }
        }]
      },
      status: 'sent'
    };

    return this.client.envelopes.createEnvelope(envelope);
  }

  async getEnvelopeStatus(envelopeId: string) {
    return this.client.envelopes.getEnvelope(envelopeId);
  }
}