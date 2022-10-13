export async function getContentfulProjects() {
    try {
        const projectsHeaders = new Headers({
            'Authorization': 'Bearer ' + process.env.REACT_APP_CONTENTFUL_API_KEY
        });
        const requestOptions = {
            method: 'GET',
            headers: projectsHeaders,
            redirect: 'follow'
        };
        const response = await fetch('https://cdn.contentful.com/spaces/mskeskqf4sb9/entries?order=-fields.endYear,-fields.startYear,-sys.createdAt&content_type=project', requestOptions);
        const responseJson = await response.json();
        
        return {
            data: responseJson,
            error: ''
        }
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }
}