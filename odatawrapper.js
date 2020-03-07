const express = require('express');
const app = express();
const https = require('https');
var stringify = require('json-stringify-safe');
var randomstring = require("randomstring");
const request = require('request-promise');
var extend = require('extend');
var compression = require('compression');
var oDestination = require('./destination.json');
var sXCsrfToken = "";
var mCookie = "";

app.use(compression())
app.get('/', function (req, res) {

    var a = [];
    a[0] = a;
    a[1] = 123;
    stringify(a);
    res.send(JSON.stringify(req));
});

app.get(/^\/sap.*$/, function (req, res) {

    console.info("destination:-" + stringify(oDestination));
    var sServerUrl = oDestination.URL + "/" + req.url; //getServerUrl(req.url);

    callViaDestination({
        url: sServerUrl,
        contentType: getContentTypeFromHeader(req),
        http_method: req.method,
        techErrorOnly: false,
        binary: false,
        fullResponse: true,
        req: req,
        qs: { "sap-client": oDestination['sap-client'] }
    }).then(result => {
        var sUrl = req.url;


        if (req.method == "HEAD") {
            sXCsrfToken = result.headers['x-csrf-token'];
            mCookie = result.headers['set-cookie'];
            console.info("app.get:-" + sUrl);
            console.info("app.get:-" + stringify(result.headers));
        }

        res.writeHead(200, "OK", result.headers);
        res.end(result.body);
    })
        .catch(error => {
            res.end('ERROR: ' + error.message + ' - FULL ERROR: ' + error.error);
        });
});

app.post(/^\/sap.*$/, function (req, res) {
    var sServerUrl = oDestination.URL+ "/" + req.url; //getServerUrl(req.url);
    aBatchBodyParts = [];

    var sBody = '';
    req.on('data', function (data) {
        sBody += data;
    });
    console.info("body:-" + sBody);

    req.on('end', function () {
        var sRequestBoundary = "--" + req.headers["content-type"].split(";")[1].split("=")[1];
        var aEntities = getEntitiesFromBatchCallPayload(sBody, sRequestBoundary);
        var sResponseBoundary = randomstring.generate({
            length: 33,
            capitalization: 'uppercase'
        });

        var sResponseBoundary1 = randomstring.generate({
            length: 33,
            capitalization: 'uppercase'
        });
        var sStatusCode;

        console.info("headers:" + stringify(req));


        var aPromises = performBatch(aEntities, sServerUrl, {
            //	http_method: "GET",
            //	payload: undefined,
            formData: undefined,
            fullResponse: true,
            techErrorOnly: false,
            binary: false,
            xcsrftoken: sXCsrfToken,
            cookie: mCookie,
            qs: { "sap-client": oDestination['sap-client'],
            req: req,
            "$format": "json" }
        });

        Promise.all(aPromises).then(aResult => {
            res.writeHead(200, "OK", {
                'Content-Type': "multipart/mixed; boundary=" + sResponseBoundary
            });

            aResult.forEach(function (oResult, iIndex) {
                sStatusCode = oResult.statusCode;
                console.info("then:" + stringify(oResult) + " " + statusCodes[sStatusCode]);

                if (iIndex === 0) {
                    res.write("--" + sResponseBoundary + '\r\n');
                    if (sStatusCode === 204) {
                        res.write("Content-Type: multipart/mixed; boundary=" + sResponseBoundary1 + '\r\n');
                        res.write("Content-Length:       377\r\n");
                        res.write('\r\n');
                        res.write("--" + sResponseBoundary1 + '\r\n');
                    }

                } else {
                    if (sStatusCode === 204) {
                        res.write("\r\n--" + sResponseBoundary1 + '\r\n');
                    } else {
                        res.write("\r\n--" + sResponseBoundary + '\r\n');
                    }
                }

                if (sStatusCode === 204) {
                    res.write(getMultiPartHeaders(sStatusCode, null, 0));
                    res.write("sap-message: " + oResult.headers["sap-message"]);
                } else {
                    //res.write('\r\n');
                    res.write(getMultiPartHeaders(sStatusCode, "application/json", 43868));
                    res.write('\r\n');
                    res.write(oResult.body);
                }
            });
            if (sStatusCode === 204) {
                res.write("\r\n");
                res.write("\r\n");
                res.write("\r\n");
                res.write("--" + sResponseBoundary1 + "--\r\n");
            } else {

            }
            res.write("\r\n--" + sResponseBoundary + "--");
            res.end();
        }).catch(error => {
            res.end('ERROR: ' + error.message + ' - FULL ERROR: ' + error.error);
        });
    });
});

const HTTP_Verb = {
	GET: 'GET',
	POST: 'POST',
	PATCH: 'PATCH',
	MERGE: 'MERGE',
	DELETE: 'DELETE',
	HEAD: 'HEAD',
	OPTIONS: 'OPTIONS',
	PUT: 'PUT'
};
const statusCodes = {

};

statusCodes[202] = "Accepted";
statusCodes[502] = "Bad Gateway";
statusCodes[400] = "Bad Request";
statusCodes[409] = "Conflict";
statusCodes[100] = "Continue";
statusCodes[201] = "Created";
statusCodes[417] = "Expectation Failed";
statusCodes[424] = "Failed Dependency";
statusCodes[403] = "Forbidden";
statusCodes[504] = "Gateway Timeout";
statusCodes[410] = "Gone";
statusCodes[505] = "HTTP Version Not Supported";
statusCodes[418] = "I'm a teapot";
statusCodes[419] = "Insufficient Space on Resource";
statusCodes[507] = "Insufficient Storage";
statusCodes[500] = "Server Error";
statusCodes[411] = "Length Required";
statusCodes[423] = "Locked";
statusCodes[420] = "Method Failure";
statusCodes[405] = "Method Not Allowed";
statusCodes[301] = "Moved Permanently";
statusCodes[302] = "Moved Temporarily";
statusCodes[207] = "Multi-Status";
statusCodes[300] = "Multiple Choices";
statusCodes[511] = "Network Authentication Required";
statusCodes[204] = "No Content";
statusCodes[203] = "Non Authoritative Information";
statusCodes[406] = "Not Acceptable";
statusCodes[404] = "Not Found";
statusCodes[501] = "Not Implemented";
statusCodes[304] = "Not Modified";
statusCodes[200] = "OK";
statusCodes[206] = "Partial Content";
statusCodes[402] = "Payment Required";
statusCodes[308] = "Permanent Redirect";
statusCodes[412] = "Precondition Failed";
statusCodes[428] = "Precondition Required";
statusCodes[102] = "Processing";
statusCodes[407] = "Proxy Authentication Required";
statusCodes[431] = "Request Header Fields Too Large";
statusCodes[408] = "Request Timeout";
statusCodes[413] = "Request Entity Too Large";
statusCodes[414] = "Request-URI Too Long";
statusCodes[416] = "Requested Range Not Satisfiable";
statusCodes[205] = "Reset Content";
statusCodes[303] = "See Other";
statusCodes[503] = "Service Unavailable";
statusCodes[101] = "Switching Protocols";
statusCodes[307] = "Temporary Redirect";
statusCodes[429] = "Too Many Requests";
statusCodes[401] = "Unauthorized";
statusCodes[422] = "Unprocessable Entity";
statusCodes[415] = "Unsupported Media Type";
statusCodes[305] = "Use Proxy";

/**
 * call a url in a destination via CF's included proxy
 *
 * @param {Map} parameters - various configuration options
 * @param {string} parameters.url - the absolute path (e.g. /my/api) to call in the destination
 * @param {string} [parameters.contentType]
 * @param {('GET'|'POST'|'MERGE'|'DELETE')} parameters.http_method
 * @param {object} [parameters.payload] - payload for POST, PUT or PATCH
 * @param {object} [parameters.formData] - play a browser a submit a form!
 * @param {boolean} [parameters.fullResponse] - pass entire reponse through from BE via proxy
 * @param {boolean} [parameters.techErrorOnly] - get a rejection only if the request failed for technical reasons
 * @param {boolean} [parameters.binary] - whether to expect (and deliver) a binary at @param url
 * @returns {Promise<T | never>}
 */

const callViaDestination = function (parameters) {
    var sUser, sUserPassword;
    let {
        url,
        contentType,
        http_method,
        payload,
        fullResponse,
        formData,
        techErrorOnly,
        binary,
        xcsrftoken,
        cookie,
        qs,
        req
    } = parameters;

    let headers = {};
    let options = {
        url: url,
        resolveWithFullResponse: fullResponse,
        simple: !techErrorOnly,
        qs: qs,
        //destination.destinationConfiguration["sap-client"] },
        insecure: true,
        rejectUnauthorized: false,//add when working with https sites
        requestCert: false,//add when working with https sites
        agent: false//add when working with https sites
    };

    // this allows binary downloads
    if (binary) {
        Object.assign(options, {
            encoding: null
        });
    }


    // if configured in CF cockpit,
    // use auth data
   // if (destination.authTokens && destination.authTokens[0]) {
        //headers["Authorization"] = destination.authTokens[0].type + " " + destination.authTokens[0].value;
    // if(oDestination.User && oDestination.Password){
    //     sUser = oDestination.User;
    //     sUserPassword = oDestination.Password;
    // } else {
    //     var oUser = auth(req);
    //     sUser = oUser['name'];
    //     sUserPassword = oUser['pass'];
    // }
    
    headers["Authorization"] = "Basic " + new Buffer(oDestination.User + ':' + oDestination.Password).toString("base64");
    //}

    //headers['SAP-Connectivity-SCC-Location_ID'] = destination.destinationConfiguration.CloudConnectorLocationId;

    // enrich query option based on http verb
    switch (http_method) {
        case HTTP_Verb.GET:
            Object.assign(options, {
                method: HTTP_Verb.GET,
                headers: Object.assign(headers, {
                    'Content-type': contentType
                }),
                headers: Object.assign(headers, {
                    'Accept': contentType
                })
            });
            break;
        case HTTP_Verb.HEAD:
            Object.assign(options, {
                method: HTTP_Verb.HEAD,
                headers: Object.assign(headers, {
                    'Content-type': contentType,
                    'Accept': contentType,
                    'x-csrf-token': 'Fetch'
                })
            });
            console.info("HEAD:-" + stringify(options));
            break;
        case HTTP_Verb.POST:
            // processing of "browser submitting form" behaviour
            // and regular (JSON) post is different
            if (parameters.formData) {
                Object.assign(options, {
                    method: HTTP_Verb.POST,
                    headers: headers,
                    formData: formData
                });
            } else {
                Object.assign(options, {
                    method: HTTP_Verb.POST,
                    headers: Object.assign(headers, {
                        'Content-type': contentType,
                        'Accept': contentType,
                        'x-csrf-token': xcsrftoken,
                        'Cookie': cookie
                    }),
                    body: payload,
                    json: true
                });
            }
            break;
        case HTTP_Verb.MERGE:
            Object.assign(options, {
                method: HTTP_Verb.PUT,
                headers: Object.assign(headers, {
                    'Content-type': contentType,
                    'Accept': contentType,
                    'x-csrf-token': xcsrftoken,
                    'Cookie': cookie
                }),
                body: payload,
                json: true
            });
            console.info("PUT:-" + stringify(options));
            break;
        case HTTP_Verb.DELETE:
            Object.assign(options, {
                method: HTTP_Verb.DELETE,
                headers: headers
            });
            break;
    }

    console.info("callviadestination:-" + options.url + " " + stringify(options));

    return request(options)
        .catch(err => {
            throw err; // bubble-up
        });
};

/**
 * Fetch ContentType from Header
 * @param {Object} oRequest Request Object
 * @returns {String} Content Type Requested
 */
const getContentTypeFromHeader = function (oRequest) {
    return oRequest.headers["Accept"];
};


/**
 * Fetch Batch call Request body
 * @param {String} sBody Request Body
 * @param {String} sBoundary Batch call boundary
 * @returns {Array} Batch Body parts
 */
const getBatchCallBody = function (sBody, sBoundary) {
    if (aBatchBodyParts.length > 0) {
        return extend(true, [], aBatchBodyParts);
    }

    aBatchBodyParts = sBody && sBoundary ? sBody.split(sBoundary) : [];
    console.info(aBatchBodyParts);

    return extend(true, [], aBatchBodyParts);
};

/**
 * Function is used to Fetch Header from Batch call body
 * @param {Array} aPartContent Batch call payload Content
 * @param {String} sKey Key to fetch header details
 * @returns {String|Object} Header for specific key
 */
const getHeadersFromBatchCallBody = function (aPartContent, sKey) {
    var mHeaderDetails;

    mHeaderDetails = aPartContent.find(function (mPartContent) {
        return mPartContent.indexOf(sKey) >= 0;
    });

    return mHeaderDetails;
};


/**
 * Fetch Response Header in Multi Part Format
 * @param {String} sStatusCode Status Code
 * @param {String} sContentType Content Type
 * @param {String} sContentLength Content Length
 * @returns {String} Response Header in Multi Part Format
 */
const getMultiPartHeaders = function (sStatusCode, sContentType, sContentLength) {
    var sResponse = "";

    sResponse += 'Content-Type: application/http\r\n';
    sResponse += 'Content-length: 43868' + '\r\n';
    sResponse += 'content-transfer-encoding: binary\r\n';
    sResponse += '\r\n';
    sResponse += 'HTTP/1.1 ' + sStatusCode + ' ' + statusCodes[sStatusCode] + '\r\n';
    if (sContentType) {
        sResponse += 'Content-Type: ' + sContentType + '\r\n';
    }

    sResponse += 'Content-Length: ' + sContentLength + '\r\n';
    sResponse += 'dataserviceversion: 2.0\r\n';
    sResponse += 'cache-control: no-store, no-cache\r\n';

    return sResponse;
};

/**
 * Funciton is used to Fetch Entities from batch call payload
 * @param {String} sBody Status Code
 * @param {String} sBoundary Content Type
 * @returns {Array} Entitiy names for triggering batch calls
 */
const getEntitiesFromBatchCallPayload = function (sBody, sBoundary) {
    var aPartContent;
    var aEntity = [];
    var aBatchCallBody = extend(true, [], getBatchCallBody(sBody, sBoundary));
    var oEntity = {};

    console.info("BatchCallBody:-" + stringify(aBatchCallBody) + " " + aBatchCallBody.length);

    var aParts = aBatchCallBody.filter(function (sPart) {
        return sPart.indexOf("HTTP/1.1") >= 0;
    });

    console.info("Parts:-" + stringify(aParts) + ":->" + aParts.length);

    aParts.forEach(function (sPart) {
        oEntity = {};
        console.info("individualpart:-" + sPart);
        aPartContent = sPart.split("\n");
        console.info("aPartCOntent" + stringify(aPartContent));

        oEntity.Entity = getHeadersFromBatchCallBody(aPartContent, "HTTP/1.1").split(" ")[1];
        oEntity.Http_Method = getHeadersFromBatchCallBody(aPartContent, "HTTP/1.1").split(" ")[0];
        oEntity.ContentType = getHeadersFromBatchCallBody(aPartContent, "Accept:").split(":")[1];
        oEntity.payload = oEntity.Http_Method == "POST" || oEntity.Http_Method == "MERGE" ?
            getHeadersFromBatchCallBody(aPartContent, "{") : undefined;

        aEntity.push(oEntity);
    });

    console.info("Entities:-" + stringify(aEntity));

    return aEntity;
};
/**
 * Function is used to call Perform Batch
 * @param {Array} aEntities Entities which needs to be called in Batch call 
 * @param {String} sUrl Service Url
 * @param {Object} oOptions Calling Parameters
 * @returns {Array} Batch call promise object 
 */
const performBatch = function (aEntities, sUrl, oOptions) {
    var aPromises = [];
    aEntities.forEach(function (oEntity) {
        oOptions["url"] = sUrl.replace("$batch", "") + oEntity.Entity;// getServerUrl(url.replace("$batch", "") + sEntity);
        oOptions["contentType"] = oEntity.ContentType.replace(" ", "").replace("\r", "");
        oOptions["http_method"] = oEntity.Http_Method;
        oOptions["payload"] = oEntity.payload ? JSON.parse(oEntity.payload.replace("\r", "").replace(" ", "")) : null;

        console.info("performBatch:" + stringify(oOptions));

        aPromises.push(callViaDestination(oOptions));
    });

    return aPromises;
};

var server = require("http").createServer(app);
var port = 5006;

//server.on("request", app);

server.listen(port, function () {
    console.info("Backend: " + server.address().port);
});