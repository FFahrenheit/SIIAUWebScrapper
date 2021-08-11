/***
 * chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
 */

const base_url = 'http://consulta.siiau.udg.mx/wco/sspseca.consulta_oferta';

let nrc = '165121';
let crsep = 'ET340';

window.addEventListener('load', () => {
    console.log('Ready to web scrap!');
    let repeat = setInterval(() => {

        fetch(base_url, {
            method: 'POST',
            // mode: 'no-cors',
            // credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            body: new URLSearchParams({
                'ciclop': '202120',
                'cup': 'D',
                'crsep': crsep
            })
        })
            .then(response => response.body)
            .then(rb => {
                const reader = rb.getReader();

                return new ReadableStream({
                    start(controller) {
                        // The following function handles each data chunk
                        function push() {
                            // "done" is a Boolean and value a "Uint8Array"
                            reader.read().then(({ done, value }) => {
                                // If there is no more data to read
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                // Get the data and send it to the browser via the controller
                                controller.enqueue(value);
                                // Check chunks by logging to the console
                                push();
                            })
                        }

                        push();
                    }
                });
            })
            .then(stream => {
                // Respond with our stream
                return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
            })
            .then(result => {
                // Do things with result
                // console.log(result);
                checkCupos(result);
            });
    }, 1000);

}, false);


let checkCupos = (stream) =>{
    str = stream.substring(
        stream.indexOf(nrc)
    );
    
    str = str.substring(
        0,
        str.indexOf('<TABLE')
    );

    str = str.substring(
        0,
        str.lastIndexOf('<TD')
    );

    str = str.slice(0,-6);

    str = str.substring(
        str.lastIndexOf('>') + 1
    );


    console.log(`[${new Date().toLocaleString()}] Cupos = ${str}`);

    if(str != '0'){
        open('mailto:test@example.com');
        alert('Cupo!');
    }
}