// SoundCloudEmbed.js
import React from 'react';

const SoundCloudEmbed = ({ url, height = "450", width = "100%" }) => {
    return (
        <div>
            <iframe
                width={width}
                height={height}
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                title="SoundCloud Player"
            ></iframe>
            <div style={{ 
                fontSize: '10px', 
                color: '#cccccc', 
                lineBreak: 'anywhere', 
                wordBreak: 'normal', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap', 
                textOverflow: 'ellipsis', 
                fontFamily: 'Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif', 
                fontWeight: 100 
            }}>
                <a href="https://soundcloud.com/toks99" title="Deebee" target="_blank" rel="noopener noreferrer" style={{ color: '#cccccc', textDecoration: 'none' }}>
                    Deebee
                </a> · 
                <a href="https://soundcloud.com/toks99/sets/afrobeats-amapiano-mix-2024" title="AFROBEATS &amp; AMAPIANO MIX 2024 🌍 **UPDATED WEEKLY** Asake|Burna|Wizkid|Davido|Fireboy" target="_blank" rel="noopener noreferrer" style={{ color: '#cccccc', textDecoration: 'none' }}>
                    AFROBEATS &amp; AMAPIANO MIX 2024 🌍 **UPDATED WEEKLY** Asake|Burna|Wizkid|Davido|Fireboy
                </a>
            </div>
        </div>
    );
};

export default SoundCloudEmbed;
