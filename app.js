//Import Polkadot API package
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

//connect to local DEV NODE
const WEB_SOCKET = 'ws://127.0.0.1:9944';

/* Sleep Thread */
const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

/* Make Connection */
const EstablishConnection = async () =>
{
    const provider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({ provider, types: {} });
    await api.isReady;
    console.log('API is Ready')
    return api;
}

/* Retrive Chain Information */
const RetrieveChainInfo = async (api: ApiPromise) =>
{
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
      ]);
    console.log(`You are now connected to ${chain}, Node version: ${nodeName} v${nodeVersion}`);
}


const SubscribeRuntimeEvents = async (api: ApiPromise) =>
{
    api.query.system.events((events: any) => 
    {
        console.log(`\nReceived ${events.length} events:`);

        events.forEach((record: any) => 
        {
            const { event, phase } = record;
            const types = event.typeDef;
            
            console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
            
            event.data.forEach((data: any, index: any) => 
            { 0
                console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
            });
        });
    });
}


async function main () 
{

    const api = await EstablishConnection();

    RetrieveChainInfo(api);
    
    await SubscribeRuntimeEvents(api);
    
    await sleep(600000);
}

main().catch(console.error).finally(() => process.exit());
