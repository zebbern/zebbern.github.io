// Claude Code - Shared JavaScript for Multi-Page Site
// Enhanced functionality with search, navigation, and user experience features

// Search functionality
const searchData = [
    // Installation
    { title: "Windows Installation", description: "Complete setup guide for Windows using WSL", category: "Installation", url: "windows.html", keywords: ["windows", "wsl", "install", "setup"] },
    { title: "macOS Installation", description: "Native macOS installation with Homebrew", category: "Installation", url: "macos.html", keywords: ["macos", "homebrew", "install", "setup", "apple"] },
    { title: "Linux Installation", description: "Distribution-specific guides for Ubuntu, Debian, Fedora", category: "Installation", url: "linux.html", keywords: ["linux", "ubuntu", "debian", "fedora", "install"] },
    
    // Commands
    { title: "Commands Reference", description: "Complete reference guide for all Claude Code commands", category: "Commands", url: "commands.html", keywords: ["commands", "reference", "terminal", "cli"] },
    { title: "Pre-Terminal Commands", description: "Commands to run before launching Claude Code", category: "Commands", url: "commands.html#pre-terminal", keywords: ["pre-terminal", "setup", "launch", "configuration"] },
    { title: "Interactive Commands", description: "Complete list of all available interactive commands", category: "Commands", url: "commands.html#interactive", keywords: ["commands", "interactive", "terminal"] },
    { title: "Model Selection", description: "Choose between Claude Opus 4, Sonnet 4, and Haiku 3.5", category: "Features", url: "features.html#models", keywords: ["models", "opus", "sonnet", "haiku", "claude"] },
    { title: "Usage Modes", description: "Interactive, one-shot, headless, and planning modes", category: "Features", url: "features.html#modes", keywords: ["modes", "interactive", "headless", "planning"] },
    
    // MCP
    { title: "MCP Setup", description: "Model Context Protocol configuration and servers", category: "MCP", url: "mcp.html", keywords: ["mcp", "model context protocol", "servers", "setup"] },
    { title: "Remote MCP", description: "Connect to remote MCP servers with OAuth", category: "MCP", url: "mcp.html#remote", keywords: ["remote", "oauth", "mcp", "servers"] },
    { title: "Popular MCP Servers", description: "Essential MCP servers for development", category: "MCP", url: "mcp.html#servers", keywords: ["servers", "github", "filesystem", "puppeteer"] },
    
    // Examples
    { title: "Quick Commands", description: "Common one-liner commands for rapid development", category: "Examples", url: "examples.html#quick", keywords: ["quick", "commands", "examples", "one-liner"] },
    { title: "Advanced Workflows", description: "Complex development scenarios and solutions", category: "Examples", url: "examples.html#workflows", keywords: ["workflows", "advanced", "tdd", "debugging"] },
    { title: "IDE Integration", description: "VS Code and Cursor integration examples", category: "Examples", url: "examples.html#ide", keywords: ["ide", "vscode", "cursor", "integration"] },
    
    // Resources
    { title: "Troubleshooting", description: "Common issues and solutions", category: "Resources", url: "resources.html#troubleshooting", keywords: ["troubleshooting", "issues", "problems", "solutions"] },
    { title: "Community Guides", description: "Community tutorials and best practices", category: "Resources", url: "resources.html#community", keywords: ["community", "guides", "tutorials", "best practices"] },
    { title: "Enterprise Features", description: "Bedrock, Vertex AI, and enterprise deployment", category: "Resources", url: "resources.html#enterprise", keywords: ["enterprise", "bedrock", "vertex", "deployment"] }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeSearch();
    initializeMobileMenu();
    initializeAnimations();
    initializeCodeBlocks();
    initializeQuickActions();
    initializeEnhancedFeatures();
    initializeCollapsibleSearch();
    initializeMobileDropdowns();
    detectOS();
});

// Header scroll effect
function initializeHeader() {
    const header = document.getElementById('header');
    // Cache DOM queries
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let ticking = false;
    let lastKnownScrollY = 0;
    
    // Throttled scroll handler combining both header and navigation effects
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Only update if scroll changed significantly
        if (Math.abs(scrollY - lastKnownScrollY) < 5) {
            ticking = false;
            return;
        }
        lastKnownScrollY = scrollY;

        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active navigation highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        ticking = false;
    }
    
    // Scroll event listener disabled for better performance

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchResults = document.getElementById('mobileSearchResults');
    
    // Desktop search
    if (searchInput && searchResults) {
        let searchTimeout;

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.classList.remove('show');
                return;
            }

            searchTimeout = setTimeout(() => {
                performSearch(query, searchResults);
            }, 150);
        });
    }
    
    // Mobile search
    if (mobileSearchInput && mobileSearchResults) {
        let mobileSearchTimeout;
        
        mobileSearchInput.addEventListener('input', function() {
            clearTimeout(mobileSearchTimeout);
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                mobileSearchResults.classList.remove('show');
                return;
            }

            mobileSearchTimeout = setTimeout(() => {
                performSearch(query, mobileSearchResults);
            }, 300);
        });
    }
    
    if (!searchInput && !mobileSearchInput) return;

    // Hide search results when clicking outside (only for desktop search)
    if (searchInput && searchResults) {
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('show');
            }
        });

        // Handle keyboard navigation for desktop search
        searchInput.addEventListener('keydown', function(e) {
            const results = searchResults.querySelectorAll('.search-result');
            const activeResult = searchResults.querySelector('.search-result.active');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeResult) {
                activeResult.classList.remove('active');
                const next = activeResult.nextElementSibling;
                if (next) {
                    next.classList.add('active');
                } else {
                    results[0]?.classList.add('active');
                }
            } else {
                results[0]?.classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeResult) {
                activeResult.classList.remove('active');
                const prev = activeResult.previousElementSibling;
                if (prev) {
                    prev.classList.add('active');
                } else {
                    results[results.length - 1]?.classList.add('active');
                }
            } else {
                results[results.length - 1]?.classList.add('active');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeResult) {
                const link = activeResult.getAttribute('data-url');
                if (link) {
                    window.location.href = link;
                }
            }
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('show');
            searchInput.blur();
        }
        });
    }
}


function performSearch(query, resultsContainer) {
    const results = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descriptionMatch = item.description.toLowerCase().includes(query);
        const keywordMatch = item.keywords.some(keyword => keyword.includes(query));
        const categoryMatch = item.category.toLowerCase().includes(query);
        
        return titleMatch || descriptionMatch || keywordMatch || categoryMatch;
    });

    displaySearchResults(results, resultsContainer, query);
}

function displaySearchResults(results, container, query) {
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-result">
                <div class="search-result-title">No results found</div>
                <div class="search-result-description">Try searching for "installation", "mcp", "commands", or "examples"</div>
            </div>
        `;
        container.classList.add('show');
        return;
    }

    const html = results.slice(0, 8).map(result => `
        <div class="search-result" data-url="${result.url}" onclick="window.location.href='${result.url}'">
            <div class="search-result-category">${result.category}</div>
            <div class="search-result-title">${highlightText(result.title, query)}</div>
            <div class="search-result-description">${highlightText(result.description, query)}</div>
        </div>
    `).join('');

    container.innerHTML = html;
    container.classList.add('show');
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(99, 102, 241, 0.3); color: var(--text-primary); padding: 0;">$1</mark>');
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking on links
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.remove('show');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('show');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Animation initialization
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Animation removed for better performance
    document.querySelectorAll('.card, .animate-fade-in-up').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// Code block functionality
function initializeCodeBlocks() {
    document.querySelectorAll('.code-block').forEach(block => {
        // Add copy indicator
        const copyIndicator = document.createElement('div');
        copyIndicator.className = 'copy-indicator';
        copyIndicator.textContent = 'Click to copy';
        block.appendChild(copyIndicator);

        // Add click to copy functionality
        block.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                // Visual feedback
                const originalBorder = block.style.borderColor;
                block.style.borderColor = 'var(--text-success)';
                copyIndicator.textContent = 'Copied!';
                copyIndicator.classList.add('copied');
                
                setTimeout(() => {
                    block.style.borderColor = originalBorder;
                    copyIndicator.textContent = 'Click to copy';
                    copyIndicator.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                copyIndicator.textContent = 'Copy failed';
                setTimeout(() => {
                    copyIndicator.textContent = 'Click to copy';
                }, 2000);
            });
        });
    });
}

// Quick actions functionality
function initializeQuickActions() {
    // Add scroll to top functionality
    const scrollToTopBtn = document.querySelector('.quick-action[title="Back to Top"]');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Quick actions always visible for better performance
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.style.opacity = '1';
        quickActions.style.transform = 'translateY(0)';
    }
}

// Enhanced OS Detection and Recommendations
function detectOS() {
    // More accurate OS detection
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    let detectedOS = '';
    let osName = '';
    let recommendation = '';
    
    // Detect Windows
    if (platform.includes('win') || userAgent.includes('windows')) {
        detectedOS = 'windows';
        osName = 'Windows detected';
        recommendation = 'You\'ll need to install WSL (Windows Subsystem for Linux) to run Claude Code.';
    }
    // Detect macOS
    else if (platform.includes('mac') || userAgent.includes('mac os')) {
        detectedOS = 'macos';
        // Detect Apple Silicon vs Intel
        if (userAgent.includes('intel')) {
            osName = 'macOS (Intel) detected';
            recommendation = 'Perfect! Claude Code runs natively on Intel Macs with Homebrew.';
        } else {
            osName = 'macOS (Apple Silicon) detected';
            recommendation = 'Excellent! Claude Code is optimized for Apple Silicon Macs.';
        }
    }
    // Detect Linux
    else if (platform.includes('linux') || userAgent.includes('linux')) {
        detectedOS = 'linux';
        osName = 'Linux detected';
        recommendation = 'Great choice! Claude Code runs natively on Linux with full feature support.';
    }

    // Show OS detection result on homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        showOSDetectionResult(detectedOS, osName, recommendation);
    }

    // Highlight detected OS in navigation dropdowns
    if (detectedOS) {
        highlightDetectedOS(detectedOS);
    }
}

function showOSDetectionResult(detectedOS, osName, recommendation) {
    const resultDiv = document.getElementById('osDetectionResult');
    const detectedOSSpan = document.getElementById('detectedOS');
    const recommendationP = document.getElementById('osRecommendation');
    
    if (resultDiv && detectedOS) {
        detectedOSSpan.textContent = osName;
        recommendationP.textContent = recommendation;
        resultDiv.classList.remove('hidden');
        
        // Add recommended styling to the corresponding OS card
        const osCards = document.querySelectorAll('.glass-secondary');
        osCards.forEach(card => {
            const href = card.getAttribute('href');
            if (href && href.includes(detectedOS)) {
                card.style.border = '2px solid var(--text-accent)';
                card.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
                
                // Add recommended badge
                const badge = document.createElement('div');
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--gradient-accent);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 10;
                `;
                badge.textContent = 'Recommended';
                card.style.position = 'relative';
                card.appendChild(badge);
            }
        });
    }
}

function highlightDetectedOS(detectedOS) {
    // Highlight in dropdown navigation
    const dropdownLinks = document.querySelectorAll('.nav-dropdown-link');
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(detectedOS + '.html')) {
            link.style.background = 'rgba(99, 102, 241, 0.1)';
            link.style.borderLeft = '3px solid var(--text-accent)';
            link.style.paddingLeft = 'calc(var(--space-sm) - 3px)';
        }
    });
}

function showOSRecommendation(os) {
    if (!os) return;

    const osCards = document.querySelectorAll('.grid .card');
    osCards.forEach(card => {
        const isRecommended = card.innerHTML.includes(os === 'windows' ? 'fab fa-windows' : 
                                                    os === 'macos' ? 'fab fa-apple' : 
                                                    'fab fa-linux');
        
        if (isRecommended) {
            // Add a recommendation badge
            const badge = document.createElement('div');
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: var(--gradient-accent);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                z-index: 10;
            `;
            badge.textContent = 'Recommended';
            card.style.position = 'relative';
            card.appendChild(badge);
            
            // Add subtle glow effect
            card.style.boxShadow = '0 8px 32px var(--glass-shadow), 0 0 20px rgba(99, 102, 241, 0.2)';
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close search
    if (e.key === 'Escape') {
        const searchResults = document.getElementById('searchResults');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (searchResults && searchResults.classList.contains('show')) {
            searchResults.classList.remove('show');
        }
        
        if (mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            document.getElementById('mobileMenuToggle').querySelector('i').className = 'fas fa-bars';
        }
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Page load time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            }
        }, 0);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send to analytics service in production
});



// Enhanced Features
function initializeEnhancedFeatures() {
    initializeCommandExplanations();
    initializePerformanceOptimizations();
}

function initializeCommandExplanations() {
    // Add tooltips to common commands
    const commandExplanations = {
        'npm install -g @anthropic-ai/claude-code': 'Installs Claude Code globally using npm package manager',
        'claude': 'Starts Claude Code in interactive mode',
        'claude --model claude-opus-4': 'Starts Claude Code with the most capable Opus 4 model',
        'claude -p': 'Runs Claude Code with a specific prompt in one-shot mode',
        '/clear': 'Clears the conversation context to save tokens',
        '/help': 'Shows all available interactive commands',
        '/init': 'Generates CLAUDE.md documentation for your project',
        'brew install node': 'Installs Node.js using Homebrew package manager',
        'wsl --install': 'Installs Windows Subsystem for Linux',
        'sudo apt update': 'Updates the package list on Ubuntu/Debian systems'
    };
    
    // Find and wrap commands with tooltips
    document.querySelectorAll('code').forEach(codeElement => {
        const text = codeElement.textContent.trim();
        
        Object.keys(commandExplanations).forEach(command => {
            if (text.includes(command)) {
                const regex = new RegExp(`(${command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
                codeElement.innerHTML = codeElement.innerHTML.replace(regex, 
                    `<span class="command-tooltip">$1<span class="tooltip-content">${commandExplanations[command]}</span></span>`
                );
            }
        });
    });
}

function initializePerformanceOptimizations() {
    // Lazy loading disabled for better performance - load all images immediately
    const lazyElements = document.querySelectorAll('img[data-src]');
    
    lazyElements.forEach(element => {
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        element.classList.add('loaded');
    });
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
    
    // Service worker registration for caching
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker not available, continue without caching
        });
    }
}

// Collapsible Search Functionality
function initializeCollapsibleSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('searchInput');
    const searchToggle = document.querySelector('.search-toggle');
    
    if (searchContainer && searchInput && searchToggle) {
        // Start collapsed on mobile
        if (window.innerWidth <= 768) {
            searchContainer.classList.add('collapsed');
            searchInput.style.opacity = '0';
        }
        
        searchToggle.addEventListener('click', function() {
            const isCollapsed = searchContainer.classList.contains('collapsed');
            
            if (isCollapsed) {
                searchContainer.classList.remove('collapsed');
                searchContainer.classList.add('expanded');
                searchInput.style.opacity = '1';
                setTimeout(() => searchInput.focus(), 300);
            } else {
                searchContainer.classList.add('collapsed');
                searchContainer.classList.remove('expanded');
                searchInput.style.opacity = '0';
                searchInput.blur();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchContainer.classList.add('collapsed');
                searchContainer.classList.remove('expanded');
                searchInput.style.opacity = '0';
            }
        });
    }
}

// Mobile Dropdown Navigation
function initializeMobileDropdowns() {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for actual links (Home, active pages)
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return;
            }
            
            e.preventDefault();
            
            const linkText = this.textContent.trim();
            const existingDropdown = this.parentNode.querySelector('.mobile-dropdown');
            
            // Remove all other dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                if (dropdown !== existingDropdown) {
                    dropdown.remove();
                }
            });
            
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            // Create dropdown based on link text
            const dropdown = createMobileDropdown(linkText);
            if (dropdown) {
                this.parentNode.appendChild(dropdown);
            }
        });
    });
}

function createMobileDropdown(linkText) {
    const dropdown = document.createElement('div');
    dropdown.className = 'mobile-dropdown show';
    
    let content = '';
    
    switch (linkText) {
        case 'Home':
            content = `
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Quick Start</div>
                    <a href="index.html#overview" class="mobile-dropdown-link">
                        <i class="fas fa-info-circle"></i>
                        Overview
                    </a>
                    <a href="index.html#workflow" class="mobile-dropdown-link">
                        <i class="fas fa-rocket"></i>
                        Transform Workflow
                    </a>
                </div>
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Get Started</div>
                    <a href="windows.html" class="mobile-dropdown-link">
                        <i class="fab fa-windows" style="color: var(--windows-color);"></i>
                        Windows Setup
                    </a>
                    <a href="macos.html" class="mobile-dropdown-link">
                        <i class="fab fa-apple" style="color: var(--macos-color);"></i>
                        macOS Setup
                    </a>
                    <a href="linux.html" class="mobile-dropdown-link">
                        <i class="fab fa-linux" style="color: var(--linux-color);"></i>
                        Linux Setup
                    </a>
                </div>
            `;
            break;
            
        case 'Features':
            content = `
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">AI Models</div>
                    <a href="features.html#models" class="mobile-dropdown-link">
                        <i class="fas fa-brain"></i>
                        Claude 4 Models
                    </a>
                    <a href="features.html#commands" class="mobile-dropdown-link">
                        <i class="fas fa-terminal"></i>
                        Interactive Commands
                    </a>
                    <a href="features.html#modes" class="mobile-dropdown-link">
                        <i class="fas fa-cogs"></i>
                        Usage Modes
                    </a>
                </div>
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Integration</div>
                    <a href="features.html#ide" class="mobile-dropdown-link">
                        <i class="fas fa-code"></i>
                        IDE Integration
                    </a>
                    <a href="features.html#enterprise" class="mobile-dropdown-link">
                        <i class="fas fa-building"></i>
                        Enterprise Features
                    </a>
                </div>
            `;
            break;
            
        case 'MCP':
            content = `
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Setup & Configuration</div>
                    <a href="mcp.html#setup" class="mobile-dropdown-link">
                        <i class="fas fa-cog"></i>
                        Quick Setup
                    </a>
                    <a href="mcp.html#remote" class="mobile-dropdown-link">
                        <i class="fas fa-cloud"></i>
                        Remote MCP Servers
                    </a>
                    <a href="mcp.html#servers" class="mobile-dropdown-link">
                        <i class="fas fa-server"></i>
                        Popular Servers
                    </a>
                </div>
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Advanced</div>
                    <a href="mcp.html#oauth" class="mobile-dropdown-link">
                        <i class="fas fa-shield-alt"></i>
                        OAuth Integration
                    </a>
                    <a href="mcp.html#custom" class="mobile-dropdown-link">
                        <i class="fas fa-wrench"></i>
                        Custom Servers
                    </a>
                </div>
            `;
            break;
            
        case 'Examples':
            content = `
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Quick Start</div>
                    <a href="examples.html#quick" class="mobile-dropdown-link">
                        <i class="fas fa-bolt"></i>
                        Quick Commands
                    </a>
                    <a href="examples.html#workflows" class="mobile-dropdown-link">
                        <i class="fas fa-project-diagram"></i>
                        Development Workflows
                    </a>
                </div>
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Advanced</div>
                    <a href="examples.html#ide" class="mobile-dropdown-link">
                        <i class="fas fa-code"></i>
                        IDE Integration
                    </a>
                    <a href="examples.html#advanced" class="mobile-dropdown-link">
                        <i class="fas fa-rocket"></i>
                        Complex Scenarios
                    </a>
                </div>
            `;
            break;
            
        case 'Resources':
            content = `
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Help & Support</div>
                    <a href="resources.html#troubleshooting" class="mobile-dropdown-link">
                        <i class="fas fa-tools"></i>
                        Troubleshooting
                    </a>
                    <a href="resources.html#community" class="mobile-dropdown-link">
                        <i class="fas fa-users"></i>
                        Community Guides
                    </a>
                    <a href="resources.html#faq" class="mobile-dropdown-link">
                        <i class="fas fa-question-circle"></i>
                        FAQ
                    </a>
                </div>
                <div class="mobile-dropdown-section">
                    <div class="mobile-dropdown-title">Official</div>
                    <a href="resources.html#official" class="mobile-dropdown-link">
                        <i class="fas fa-file-alt"></i>
                        Documentation
                    </a>
                    <a href="resources.html#enterprise" class="mobile-dropdown-link">
                        <i class="fas fa-building"></i>
                        Enterprise
                    </a>
                </div>
            `;
            break;
            
        default:
            return null;
    }
    
    dropdown.innerHTML = content;
    return dropdown;
}

// Export functions for use in other scripts
window.ClaudeCodeSite = {
    search: performSearch,
    detectOS: detectOS,
    debounce: debounce,
    throttle: throttle,
    toggleMobileDropdown: createMobileDropdown
};