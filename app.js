document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const environmentSelect = document.getElementById('environment-select');
    const venueSelect = document.getElementById('venue-select');
    const crowdIndicators = document.getElementById('crowd-indicators');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');

    // Venues & Zones Configuration
    const venuesConfig = {
        'Hyderabad': {
            'Stadium': {
                'Rajiv Gandhi Stadium': ['Gate A', 'Gate B', 'Food Court', 'Restrooms North', 'Merch Stand']
            },
            'Theatre': {
                'PVR Hyderabad': ['Main Entrance', 'Lobby', 'Screen 1', 'Snack Bar'],
                'INOX GVK': ['Entrance', 'Lobby', 'Restrooms']
            },
            'Airport': {
                'RGIA Airport': ['Security Checkpoint A', 'Terminal 1 Gates', 'Baggage Claim', 'Taxi Stand', 'Food Court']
            },
            'Concert': {
                'Hitex Open Arena': ['Main Gate', 'VIP Entrance', 'Food Stalls', 'Restrooms block A']
            },
            'Exhibition': {
                'Hitex Exhibition Center': ['Entry Gate 1', 'Entry Gate 2', 'Hall 1', 'Cafeteria', 'Restrooms']
            },
            'Railway Station': {
                'Secunderabad Junction': ['Main Entry', 'Ticket Counter', 'Platform 1', 'Platform 10', 'Waiting Room']
            },
            'Bus Terminal': {
                'MGBS': ['Main Entrance', 'Ticket Counter', 'Platform 1', 'Food Stall', 'Restrooms']
            }
        },
        'Mumbai': {
            'Stadium': {
                'Wankhede Stadium': ['Gate 1', 'Gate 2', 'Snack Bar', 'Restrooms']
            },
            'Theatre': {
                'PVR Juhu': ['Main Entrance', 'Lobby', 'Screen 1', 'Snack Bar']
            },
            'Airport': {
                'Mumbai Airport': ['Terminal 2 Entrance', 'Security Check', 'Duty Free', 'Boarding Gates', 'Food Court']
            },
            'Concert': {
                'Jio World Garden': ['Main Gate', 'Box Office', 'Food Court', 'Restrooms']
            },
            'Exhibition': {
                'Bombay Exhibition Centre': ['Entry Gate 1', 'Hall A Main', 'Cafeteria', 'Restroom block']
            },
            'Railway Station': {
                'CSMT': ['Main Entrance', 'Ticket Arena', 'Platform 1', 'Platform 18', 'Food Stalls']
            },
            'Bus Terminal': {
                'Dadar Bus Terminal': ['Entrance Gate', 'Ticket Counter', 'Platform 1', 'Platform 2']
            }
        },
        'Delhi': {
            'Stadium': {
                'Arun Jaitley Stadium': ['Gate A', 'Food Court', 'Restrooms North']
            },
            'Theatre': {
                'PVR Director\'s Cut': ['Entrance', 'Lobby']
            },
            'Airport': {
                'IGI Airport': ['T3 Entrance', 'Security Checkpoint A', 'Terminal 3 Gates', 'Baggage Claim', 'Food Court']
            },
            'Concert': {
                'Siri Fort Auditorium': ['Main Gate', 'Auditorium Entry', 'Cafeteria', 'Restrooms']
            },
            'Exhibition': {
                'Pragati Maidan': ['Entry Gate 1', 'Hall 14 Entry', 'Food Court', 'Restrooms']
            },
            'Railway Station': {
                'New Delhi Railway Station': ['Paharganj Entry', 'Ajmeri Gate Entry', 'Platform 1', 'Ticket Counter', 'Waiting Room']
            },
            'Bus Terminal': {
                'ISBT Kashmere Gate': ['Main Gate', 'Ticket Counter', 'Platform A', 'Food Stall', 'Restrooms']
            }
        }
    };

    let currentCrowdData = {};
    let simulationInterval = null;

    function populateVenues() {
        const rawInput = cityInput.value.trim();
        const cityStr = Object.keys(venuesConfig).find(k => k.toLowerCase() === rawInput.toLowerCase());
        const city = cityStr || rawInput;
        const env = environmentSelect.value;
        const venues = venuesConfig[city]?.[env] || {};
        
        venueSelect.innerHTML = '';
        for (const venue in venues) {
            const option = document.createElement('option');
            option.value = venue;
            option.textContent = venue;
            venueSelect.appendChild(option);
        }
        
        if (venueSelect.options.length > 0) {
            venueSelect.disabled = false;
            initCrowdData();
        } else {
            venueSelect.disabled = true;
            crowdIndicators.innerHTML = '<p class="text-secondary" style="font-size: 0.85rem; padding: 0.5rem 0;">No venues available for this location yet. More locations coming soon.</p>';
            currentCrowdData = {};
        }
    }

    function initCrowdData() {
        const rawInput = cityInput.value.trim();
        const cityStr = Object.keys(venuesConfig).find(k => k.toLowerCase() === rawInput.toLowerCase());
        const city = cityStr || rawInput;
        const env = environmentSelect.value;
        const venue = venueSelect.value;
        
        const zones = venuesConfig[city]?.[env]?.[venue] || ['Main Area'];
        currentCrowdData = {};
        zones.forEach(zone => {
            currentCrowdData[zone] = Math.floor(Math.random() * 100);
        });
        renderCrowdIndicators();
    }

    function updateCrowdData() {
        for (const zone in currentCrowdData) {
            let change = Math.floor(Math.random() * 31) - 15;
            currentCrowdData[zone] = Math.max(0, Math.min(100, currentCrowdData[zone] + change));
        }
        renderCrowdIndicators();
    }

    function getCrowdStatus(level) {
        if (level < 40) return { label: 'Low', class: 'green', estimate: '2-5 minutes' };
        if (level < 75) return { label: 'Medium', class: 'yellow', estimate: '5-10 minutes' };
        return { label: 'High', class: 'red', estimate: '10-20 minutes' };
    }

    function renderCrowdIndicators() {
        crowdIndicators.innerHTML = '';
        for (const [zone, level] of Object.entries(currentCrowdData)) {
            const status = getCrowdStatus(level);
            const indicator = document.createElement('div');
            indicator.className = `indicator ${status.class}`;
            indicator.innerHTML = `
                <div class="dot"></div>
                ${zone}: ${status.label}
            `;
            crowdIndicators.appendChild(indicator);
        }
    }

    function getPayloadCrowdData() {
        const payloadData = {};
        for (const [zone, level] of Object.entries(currentCrowdData)) {
            const status = getCrowdStatus(level);
            payloadData[zone] = `${status.label} (Wait: ${status.estimate})`;
        }
        return payloadData;
    }

    // Event Listeners for Selectors
    cityInput.addEventListener('change', () => {
        populateVenues();
        const rawInput = cityInput.value.trim() || "Unknown Location";
        const cityStr = Object.keys(venuesConfig).find(k => k.toLowerCase() === rawInput.toLowerCase());
        const cityValue = cityStr || rawInput;
        
        if (venuesConfig[cityValue]) {
            if (venueSelect.value) {
                addSystemMessage(`We are now looking at **${cityValue}**. I've set the venue to **${venueSelect.value}**. How can I assist?`);
            } else {
                addSystemMessage(`We are now in **${cityValue}**, but I couldn't find any ${environmentSelect.value} locations here. More coming soon!`);
            }
        } else {
            addSystemMessage(`We don't have live tracking data for **${cityValue}** yet, but I can still offer general navigation advice! For full live tracking, try searching for **Hyderabad**, **Mumbai**, or **Delhi**.`);
        }
    });

    environmentSelect.addEventListener('change', () => {
        populateVenues();
        const rawInput = cityInput.value.trim() || "this location";
        const cityStr = Object.keys(venuesConfig).find(k => k.toLowerCase() === rawInput.toLowerCase());
        const cityValue = cityStr || rawInput;
        
        if (venueSelect.value) {
            addSystemMessage(`Switched to **${environmentSelect.value}s**. We are currently viewing **${venueSelect.value}**.`);
        } else {
            addSystemMessage(`Switched to **${environmentSelect.value}s**, but no venues are available here in **${cityValue}**.`);
        }
    });

    venueSelect.addEventListener('change', () => {
        initCrowdData();
        addSystemMessage(`We are now at **${venueSelect.value}**. Live crowd data is updating. What do you need help with?`);
    });

    // Start Simulation
    populateVenues();
    simulationInterval = setInterval(updateCrowdData, 4000);

    // Chat Logic
    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addSystemMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message system-message';
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addLoadingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message loading-message';
        msgDiv.id = 'loading-indicator';
        msgDiv.innerHTML = `
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function removeLoadingIndicator() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(message) {
        if (!message || message.trim() === '') {
            addSystemMessage("Please enter a query");
            return;
        }

        addUserMessage(message);
        chatInput.value = '';
        addLoadingIndicator();

        try {
            const rawInput = cityInput.value.trim();
            const cityStr = Object.keys(venuesConfig).find(k => k.toLowerCase() === rawInput.toLowerCase());
            const activeCity = cityStr || rawInput;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    city: activeCity,
                    environment: environmentSelect.value,
                    venue: venueSelect.value,
                    crowdData: getPayloadCrowdData()
                })
            });

            removeLoadingIndicator();

            if (response.ok) {
                const data = await response.json();
                addSystemMessage(data.reply + "<br><span class='confidence-layer'>⚡ Based on live crowd simulation</span>");
            } else {
                throw new Error('Server returned an error');
            }
        } catch (error) {
            removeLoadingIndicator();
            console.warn("API unavailable or errored out. Using demo fallback response.");
            
            // Demo fallback responses
            setTimeout(() => {
                const rawInput = cityInput.value.trim() || "this location";
                const cityStr = Object.keys(venuesConfig).find(k => k.toLowerCase() === rawInput.toLowerCase());
                const city = cityStr || rawInput;
                const venue = venueSelect.value || "this environment";
                let fallbackMessage = "";
                const lowerMsg = message.toLowerCase();
                
                if (Object.keys(currentCrowdData).length === 0) {
                    fallbackMessage = `I'm sorry, but my live tracking capabilities for **${city}** are currently limited. However, as a general strategy: always avoid peak operating hours, look for secondary entrances or alternate gates, and plan early to minimize wait times. For the best live tracking experience, try searching for **Hyderabad**, **Mumbai**, or **Delhi**!`;
                    addSystemMessage(fallbackMessage + "<br><span class='confidence-layer'>⚡ General Navigation Advice</span>");
                    return;
                }
                
                // Helper to filter zones by keyword
                const getZonesByKeyword = (keywords) => {
                    return Object.entries(currentCrowdData).filter(([zone]) => 
                        keywords.some(kw => zone.toLowerCase().includes(kw))
                    );
                };

                // Helper to get navigational zones (excluding restrooms, food, merch)
                const getNavigationalZones = () => {
                    const excludeKeywords = ['food', 'snack', 'drink', 'dining', 'court', 'restroom', 'bathroom', 'washroom', 'toilet', 'merch', 'cafeteria'];
                    const nav = Object.entries(currentCrowdData).filter(([zone]) => {
                        return !excludeKeywords.some(kw => zone.toLowerCase().includes(kw));
                    });
                    return nav.length > 0 ? nav : Object.entries(currentCrowdData);
                };

                // Helper to find lowest crowd among a specific list of zones
                const getBestZoneData = (zonesList) => {
                    if (zonesList.length === 0) return null;
                    let best = zonesList[0];
                    for (const row of zonesList) {
                        if (row[1] < best[1]) best = row;
                    }
                    return best; // returns [zoneName, level]
                };

                if (lowerMsg.match(/\b(hi|hello|hey|help)\b/)) {
                    fallbackMessage = `Hello there! I'm your OmniEvent guide for **${venue}** in **${city}**. I can help you find the fastest entry, best food spots, or simply guide you away from the crowds. What do you need?`;
                } else if (lowerMsg.includes("best entry") || lowerMsg.includes("entrance") || lowerMsg.includes("entry") || lowerMsg.includes("gate")) {
                    const entryZones = getZonesByKeyword(['gate', 'entrance', 'entry']);
                    if (entryZones.length === 1) {
                        const waitStatus = getCrowdStatus(entryZones[0][1]);
                        fallbackMessage = `At **${venue}** in **${city}**, there is only one main entry point here: **${entryZones[0][0]}**. The line is currently ${waitStatus.label.toLowerCase()}, with an estimated wait of **${waitStatus.estimate}**.`;
                    } else if (entryZones.length > 1) {
                        const bestEntry = getBestZoneData(entryZones);
                        const waitStatus = getCrowdStatus(bestEntry[1]);
                        fallbackMessage = `Comparing the available entrances at **${venue}** in **${city}**, **${bestEntry[0]}** currently has the shortest wait time (estimated **${waitStatus.estimate}**). I'd highly recommend heading there!`;
                    } else {
                        fallbackMessage = `At **${venue}** in **${city}**, I'm not seeing multiple distinct entry gates in my live tracking. Just follow the main concourse!`;
                    }
                } else if (lowerMsg.includes("food") || lowerMsg.includes("snack") || lowerMsg.includes("eat") || lowerMsg.includes("drink")) {
                    const foodZones = getZonesByKeyword(['food', 'snack', 'drink', 'dining', 'court']);
                    if (foodZones.length === 1) {
                        const waitStatus = getCrowdStatus(foodZones[0][1]);
                        fallbackMessage = `At **${venue}** in **${city}**, there's only one main dining area tracked here: **${foodZones[0][0]}**. It's currently showing a wait of **${waitStatus.estimate}**.`;
                    } else if (foodZones.length > 1) {
                        const bestFood = getBestZoneData(foodZones);
                        const waitStatus = getCrowdStatus(bestFood[1]);
                        fallbackMessage = `At **${venue}** in **${city}**, if you're looking for refreshments, heading to **${bestFood[0]}** will get you the fastest service right now, with an estimated wait of just **${waitStatus.estimate}**.`;
                    } else {
                        fallbackMessage = `I don't have live food queues for **${venue}** in **${city}** right now, but check near the main concourses!`;
                    }
                } else if (lowerMsg.includes("avoid") || lowerMsg.includes("crowd") || lowerMsg.includes("quiet") || lowerMsg.includes("less")) {
                    const navZones = getNavigationalZones();
                    const best = getBestZoneData(navZones);
                    const waitStatus = getCrowdStatus(best[1]);
                    fallbackMessage = `To avoid the heaviest crowds at **${venue}** in **${city}**, try navigating near **${best[0]}** (current flow delay: **${waitStatus.estimate}**). The central areas are operating at a higher capacity.`;
                } else if (lowerMsg.includes("bathroom") || lowerMsg.includes("restroom") || lowerMsg.includes("washroom") || lowerMsg.includes("toilet")) {
                    const bathZones = getZonesByKeyword(['restroom', 'bathroom', 'washroom', 'toilet']);
                    if (bathZones.length === 1) {
                        const waitStatus = getCrowdStatus(bathZones[0][1]);
                        fallbackMessage = `At **${venue}** in **${city}**, there's a main facility here: **${bathZones[0][0]}**. The estimated wait time is **${waitStatus.estimate}**.`;
                    } else if (bathZones.length > 1) {
                        const bestBath = getBestZoneData(bathZones);
                        const waitStatus = getCrowdStatus(bestBath[1]);
                        fallbackMessage = `At **${venue}** in **${city}**, the facilities at **${bestBath[0]}** currently have the least foot traffic, meaning a wait of roughly **${waitStatus.estimate}**.`;
                    } else {
                        fallbackMessage = `At **${venue}** in **${city}**, restrooms are usually located near the main lobbies. I don't have specific live flow data on them right now.`;
                    }
                } else if (lowerMsg.includes("time") || lowerMsg.includes("long") || lowerMsg.includes("wait")) {
                    const navZones = getNavigationalZones();
                    const best = getBestZoneData(navZones);
                    const waitStatus = getCrowdStatus(best[1]);
                    fallbackMessage = `Wait times vary across **${venue}** in **${city}**, but if you head to **${best[0]}**, the wait is currently **${waitStatus.estimate}**. Other areas might be experiencing delays!`;
                } else {
                    const navZones = getNavigationalZones();
                    const best = getBestZoneData(navZones);
                    const waitStatus = getCrowdStatus(best[1]);
                    const randomResponses = [
                        `That's a great question about **${venue}** in **${city}**. While I'm primarily focused on crowd tracking, I can tell you that **${best[0]}** is currently the clearest area with a wait time of **${waitStatus.estimate}**.`,
                        `I might not have the exact answer for that! However, if you want to avoid delays right now at **${venue}**, navigating toward **${best[0]}** (wait: **${waitStatus.estimate}**) is your best bet!`,
                        `I'm still learning about all the details of **${venue}** in **${city}**, but I'm constantly analyzing the crowd flow! By the way, the path to **${best[0]}** is looking very clear right now with only a **${waitStatus.estimate}** wait.`
                    ];
                    fallbackMessage = randomResponses[Math.floor(Math.random() * randomResponses.length)];
                }
                
                addSystemMessage(fallbackMessage + "<br><span class='confidence-layer'>⚡ Based on live crowd simulation</span>");
            }, 800);
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(chatInput.value.trim());
    });

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
    });
});
