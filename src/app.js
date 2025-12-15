const clientId = 'uo22ewr0pq7qvclkawljj0md7obcpw';
const accessToken = 'aemz706aihp12oc4tipcupv77za64r';
const username = 'der_niclas_97';

async function getUserId(username, clientId, accessToken) {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Client-Id": clientId
        }
    });
    const data = await response.json();
    return data.data[0]?.id;
}

async function getAllFollowedChannels(userId, client_id, access_token) {
    let channels = [];
    let cursor = null;
    let keepGoing = true;
    while (keepGoing) {
        let url = `https://api.twitch.tv/helix/channels/followed?user_id=${userId}&first=100`;
        if (cursor) url += `&after=${cursor}`;
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Client-Id": client_id
            }
        });
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            channels = channels.concat(data.data);
            cursor = data.pagination?.cursor;
            keepGoing = !!cursor;
        } else {
            keepGoing = false;
        }
    }
    return channels;
}

async function getLiveChannels(userIds, clientId, accessToken) {
    const liveChannels = [];
    const chunkSize = 100;
    for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const params = chunk.map(id => `user_id=${id}`).join('&');
        const url = `https://api.twitch.tv/helix/streams?${params}`;
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Client-Id": clientId
            }
        });
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            liveChannels.push(...data.data);
        }
    }
    return liveChannels;
}

function renderChannelsList(channels) {
    const list = document.getElementById('channels-list');
    if (!list) return;
    list.innerHTML = '';
    channels.forEach(channel => {
        const li = document.createElement('li');
        const channelName = channel.broadcaster_name || channel.display_name || 'Unbekannt';
        li.textContent = channelName + ' ';

        const btn = document.createElement('button');
        btn.textContent = 'Zum Stream';
        btn.onclick = () => {
            window.open('https://www.twitch.tv/' + channel.broadcaster_login, '_blank');
        };
        li.appendChild(btn);

        if(channel.title) {
            const info = document.createElement('span');
            info.textContent = ` | ${channel.title} (${channel.viewer_count} Zuschauer)`;
            li.appendChild(info);
        }
        list.appendChild(li);
    });
}

async function main() {
    const userId = await getUserId(username, clientId, accessToken);
    if (!userId) {
        console.error("User-ID konnte nicht gefunden werden.");
        return;
    }
    const channels = await getAllFollowedChannels(userId, clientId, accessToken);
    const followedUserIds = channels.map(ch => ch.broadcaster_id);
    const liveChannels = await getLiveChannels(followedUserIds, clientId, accessToken);
    const idToChannel = {};
    channels.forEach(ch => {
        idToChannel[ch.broadcaster_id] = ch;
    });
    renderChannelsList(
        liveChannels.map(stream => ({
            broadcaster_name: idToChannel[stream.user_id]?.broadcaster_name,
            broadcaster_login: idToChannel[stream.user_id]?.broadcaster_login,
            title: stream.title,
            viewer_count: stream.viewer_count
        }))
    );
}

main();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('open_twitch').addEventListener('click', function() {
        window.open('https://www.twitch.tv/' + document.getElementById('twitch_streamername').value, '_blank');
    });
});
