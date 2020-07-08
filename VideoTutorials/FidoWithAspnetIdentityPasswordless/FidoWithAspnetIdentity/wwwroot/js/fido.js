function getChallengeAsString(base64Challenge) {
    let challengeBytesAsString = atob(base64Challenge);
    return Uint8Array.from(challengeBytesAsString, c => c.charCodeAt(0));
}

function register(base64Challenge, relyingPartyId, base64UserHandle, userId, callbackUrl) {
    let challenge = getChallengeAsString(base64Challenge);

    // Supported algorithms, ordered by preference
    var pubKeyCredParams = [
        {
            type: "public-key",
            alg: -8
        },
        {
            type: "public-key",
            alg: -259
        },
        {
            type: "public-key",
            alg: -39
        },
        {
            type: "public-key",
            alg: -36
        },
        {
            type: "public-key",
            alg: -258
        },
        {
            type: "public-key",
            alg: -38
        },
        {
            type: "public-key",
            alg: -35
        },
        {
            type: "public-key",
            alg: -7
        },
        {
            type: "public-key",
            alg: -257
        },
        {
            type: "public-key",
            alg: -37
        },
        {
            type: "public-key",
            alg: -7
        },
        {
            type: "public-key",
            alg: -65535
        }
    ];

    // Relying party details
    let rp = {
        id: relyingPartyId,
        name: "FIDO Test Video"
    };

    // User handle
    let userHandleBytesAsString = atob(base64UserHandle);
    var userHandle = Uint8Array.from(
        userHandleBytesAsString, c => c.charCodeAt(0))

    let user = {
        name: userId,
        displayName: userId,
        id: userHandle
    };

    let authenticatorSelection = {
        requireResidentKey: true,
        userVerification: "required"
    };

    navigator.credentials.create({ publicKey: {challenge, rp, user, pubKeyCredParams, authenticatorSelection} })
        .then((credentials) => {
            // base64 encode array buffers
            let encodedCredentials = {
                id: credentials.id,
                rawId: btoa(String.fromCharCode.apply(null, new Uint8Array(credentials.rawId))),
                type: credentials.type,
                response: {
                    attestationObject:
                        btoa(String.fromCharCode.apply(null, new Uint8Array(credentials.response.attestationObject))),
                    clientDataJSON:
                        btoa(String.fromCharCode.apply(null, new Uint8Array(credentials.response.clientDataJSON)))
                }
            };

            // post to register callback endpoint and redirect to homepage
            $.ajax({
                url: callbackUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(encodedCredentials),
                success: function() {
                    window.location.href = "https://localhost:5001";
                },
                error: function() {
                    console.error("Error from server...");
                }
            });
        })
        .catch((error) => {
            console.error(error);
        });

}


function completeLogin(base64Challenge, relyingPartyId, callbckUrl)
{
    let challenge = getChallengeAsString(base64Challenge);
    let rpId = relyingPartyId;

    navigator.credentials.get({ publicKey: { challenge, rpId } })
        .then((result) => {
            let encodedResult = {
                id: result.id,
                rawId: btoa(String.fromCharCode.apply(null, new Uint8Array(result.rawId))),
                type: result.type,
                response: {
                    authenticatorData:
                        btoa(String.fromCharCode.apply(null, new Uint8Array(result.response.authenticatorData))),
                    signature:
                        btoa(String.fromCharCode.apply(null, new Uint8Array(result.response.signature))),
                    userHandle:
                        btoa(String.fromCharCode.apply(null, new Uint8Array(result.response.userHandle))),
                    clientDataJSON:
                        btoa(String.fromCharCode.apply(null, new Uint8Array(result.response.clientDataJSON)))
                }
            };

            $.ajax({
                url: callbckUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(encodedResult),
                success:function() {
                    window.location.href = "https://localhost:5001";
                }
            });

        })
        .catch((error) => {
            console.error(error);
        });

}

