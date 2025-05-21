document.addEventListener('DOMContentLoaded', () => {
    // Define our categories with nice color classes
    const categories = [
        { id: 'ctf', name: 'CTF', file: 'ctf.json', color: 'ctf' },
        { id: 'forensics', name: 'Digital Forensics', file: 'forensics.json', color: 'forensic' },
        { id: 'iot', name: 'IoT/IIoT', file: 'iot.json', color: 'iot' },
        { id: 'malware', name: 'Malware Analysis', file: 'malware.json', color: 'malware' },
        { id: 'network', name: 'Network & System Administration', file: 'network.json', color: 'network' },
        { id: 'osint-global', name: 'OSINT-GLOBAL (Non-US)', file: 'osint-global.json', color: 'osint' },
        { id: 'osint-general', name: 'OSINT General', file: 'osint-general.json', color: 'osint' },
        { id: 'osint-us', name: 'OSINT-US', file: 'osint-us.json', color: 'osint' },
        { id: 'pentesting', name: 'PenTesting', file: 'pentesting.json', color: 'tools' },
        { id: 'threat-hunting', name: 'Threat Hunting', file: 'threat-hunting.json', color: 'tools' },
        { id: 'biohacking', name: 'Biohacking', file: 'biohacking.json', color: 'crypto' }
    ];
    
    // Function to create navigation tabs
    function createNavTabs() {
        const tabsContainer = document.getElementById('category-tabs');
        
        categories.forEach(category => {
            const tab = document.createElement('li');
            tab.textContent = category.name;
            tab.setAttribute('data-category', category.id);
            tab.setAttribute('data-file', category.file);
            
            // Set the first tab as active by default
            if (category === categories[0]) {
                tab.classList.add('active');
            }
            
            // Add click event listener
            tab.addEventListener('click', (e) => {
                // Remove active class from all tabs
                document.querySelectorAll('#category-tabs li').forEach(el => {
                    el.classList.remove('active');
                });
                
                // Add active class to the clicked tab
                tab.classList.add('active');
                
                // Add subtle animation effect when changing tabs
                const dashboardContainer = document.getElementById('dashboard-container');
                dashboardContainer.style.opacity = '0.6';
                setTimeout(() => {
                    // Load content for the selected category
                    loadCategoryContent(category.file);
                    
                    setTimeout(() => {
                        dashboardContainer.style.opacity = '1';
                    }, 100);
                }, 150);
            });
            
            tabsContainer.appendChild(tab);
        });
    }
    
    // Function to load content for a specific category
    async function loadCategoryContent(jsonFile) {
        try {
            const dashboardContainer = document.getElementById('dashboard-container');
            dashboardContainer.innerHTML = ''; // Clear current content
            
            // First try to fetch the actual file
            let response;
            let data;
            
            try {
                response = await fetch(`projects/${jsonFile}`);
                
                if (response.ok) {
                    data = await response.json();
                } else {
                    throw new Error(`Failed to load ${jsonFile}`);
                }
            } catch (error) {
                console.log(`Error loading real file, using demo data: ${error.message}`);
                // If we can't load the real file, fall back to demo data
                loadDemoDataForCategory(jsonFile);
                return;
            }
            
            // Successfully loaded and parsed the JSON file
            if (data && data.sections) {
                // Render category content
                data.sections.forEach(section => {
                    // Use the category color from our mapping if available
                    const categoryColor = findCategoryColorById(section.category) || section.category;
                    section.category = categoryColor;
                    
                    // Create a card for this section
                    const card = createCard(section);
                    dashboardContainer.appendChild(card);
                });
                
                // Add animation to cards as they load
                animateCardsOnLoad();
            } else {
                console.error('Invalid JSON format or missing sections array');
                loadDemoDataForCategory(jsonFile);
            }
            
        } catch (error) {
            console.error(`Error loading category content:`, error);
            // Show error or fallback to demo data
            loadDemoDataForCategory(jsonFile);
        }
    }
    
    // Function to find category color by ID
    function findCategoryColorById(categoryId) {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.color : null;
    }
    
    // Animate cards when they're loaded
    function animateCardsOnLoad() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 * index); // Stagger the animations
        });
    }
    
    // Function to create a card element from JSON data
    function createCard(data) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category', data.category || 'default');
        
        // Create card header
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.textContent = data.title;
        
        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // Create resource list
        const resourceList = document.createElement('ul');
        resourceList.className = 'resource-list';
        
        // Add each resource as a list item
        data.resources.forEach(resource => {
            const listItem = document.createElement('li');
            listItem.className = 'resource-item';
            
            // Create icon if specified
            if (resource.icon) {
                const icon = document.createElement('i');
                icon.className = resource.icon;
                listItem.appendChild(icon);
            } else {
                // Default icon if none specified
                const icon = document.createElement('i');
                icon.className = 'fas fa-link';
                listItem.appendChild(icon);
            }
            
            // Create link
            const link = document.createElement('a');
            link.href = resource.url || '#';
            link.textContent = resource.name;
            link.target = '_blank'; // Open in new tab
            
            listItem.appendChild(link);
            resourceList.appendChild(listItem);
        });
        
        cardBody.appendChild(resourceList);
        
        // Assemble the card
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        
        return card;
    }
    
    // Initialize the navigation and load the first category
    function initializeApp() {
        createNavTabs();
        
        // Load the first category by default
        if (categories.length > 0) {
            loadCategoryContent(categories[0].file);
        }
    }
    
    // Initialize the application
    initializeApp();
    
    // For demonstration purposes, load demo data if the JSON file doesn't exist
    function loadDemoDataForCategory(categoryFile) {
        const dashboardContainer = document.getElementById('dashboard-container');
        dashboardContainer.innerHTML = ''; // Clear current content
        
        // Get the category name from the filename
        const categoryId = categoryFile.replace('.json', '');
        
        // Find the category details
        const category = categories.find(cat => cat.id === categoryId) || 
                         { id: categoryId, color: 'default' };
        
        // Demo data based on the category
        let demoSections = [];
        
        switch(categoryId) {
            case 'ctf':
                demoSections = [
                    {
                        title: "New to CTF",
                        category: category.color,
                        resources: [
                            { name: "CTF Field Guide", url: "#", icon: "fas fa-book" },
                            { name: "Hackerstoolkit.co", url: "#", icon: "fas fa-toolbox" },
                            { name: "Commando", url: "#", icon: "fas fa-terminal" }
                        ]
                    },
                    {
                        title: "CTF Sites (schedule only)",
                        category: category.color,
                        resources: [
                            { name: "CTF Time Events", url: "#", icon: "fas fa-calendar" }
                        ]
                    },
                    {
                        title: "CTF Sites (24/7 avail)",
                        category: category.color,
                        resources: [
                            { name: "OverTheWire: Wargames", url: "#", icon: "fas fa-gamepad" },
                            { name: "RingZer0", url: "#", icon: "fas fa-ring" },
                            { name: "Root Me", url: "#", icon: "fas fa-server" }
                        ]
                    }
                ];
                break;
                
            case 'forensics':
                demoSections = [
                    {
                        title: "Forensic Test/CTF Images",
                        category: category.color,
                        resources: [
                            { name: "DFIR Artifact Museum", url: "#", icon: "fas fa-microscope" },
                            { name: "ACSC cyber security challenge", url: "#", icon: "fas fa-shield-alt" },
                            { name: "Case 001 - Stolen Szechuan Sauce", url: "#", icon: "fas fa-folder-open" }
                        ]
                    }
                ];
                break;
                
            case 'network':
                demoSections = [
                    {
                        title: "Network Traffic Analysis",
                        category: category.color,
                        resources: [
                            { name: "Geo Traceroute", url: "#", icon: "fas fa-globe" },
                            { name: "Hex Packet Decoder", url: "#", icon: "fas fa-network-wired" },
                            { name: "SciV (AS58839) BGP Map", url: "#", icon: "fas fa-map" }
                        ]
                    }
                ];
                break;
                
            default:
                // Generic demo data for other categories
                demoSections = [
                    {
                        title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ')} Resources`,
                        category: category.color,
                        resources: [
                            { name: "Resource 1", url: "#", icon: "fas fa-link" },
                            { name: "Resource 2", url: "#", icon: "fas fa-link" },
                            { name: "Resource 3", url: "#", icon: "fas fa-link" }
                        ]
                    }
                ];
        }
        
        // Create cards for each section
        demoSections.forEach(section => {
            const card = createCard(section);
            dashboardContainer.appendChild(card);
        });
        
        // Animate cards
        animateCardsOnLoad();
    }
});