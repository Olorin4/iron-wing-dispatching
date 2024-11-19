export async function fetchData() {
    try {
        const responses = await fetch(
            "url",
            {
                method: "GET",
                headers: {
                    // You can add headers here if needed
                },
            }
        );

        // Check if the response is OK (status in the range 200-299)
        if (!responses.ok) {
            throw new Error(`HTTP error! Status: ${responses.status}`);
        }

        // Parse the response body as JSON
        const data = await responses.json();
        console.log(responses);
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// - Giphy API key: whAYeCrLmz9oafsWIiZKgRgYOEK6wFsw.
