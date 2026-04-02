const axios = require('axios');

class ApiVideoService {
    constructor() {
        this.apiKey = null;
        this.baseUrl = null;
        this.accessToken = null;
        this.tokenExpiry = null;
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.apiKey = process.env.API_VIDEO_API_KEY;
        if (!this.apiKey) {
            console.error('[ApiVideo] ERROR: API_VIDEO_API_KEY not found in environment variables');
            return;
        }

        this.baseUrl = process.env.API_VIDEO_BASE_URL || 'https://sandbox.api.video';
        
        this.isInitialized = true;
        console.log(`[ApiVideo] Client initialized with base URL: ${this.baseUrl}`);
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(`${this.baseUrl}/auth/api-key`, {
                apiKey: this.apiKey
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
            
            console.log('[ApiVideo] Obtained new access token');
            return this.accessToken;
        } catch (error) {
            console.error('[ApiVideo] Failed to get access token:', error.response?.data || error.message);
            throw new Error(`Failed to authenticate with api.video: ${error.response?.data?.message || error.message}`);
        }
    }

    async uploadVideo(filePath, title) {
        if (!this.isInitialized) this.initialize();

        if (!this.apiKey) {
            throw new Error('ApiVideo API key not configured');
        }

        try {
            const token = await this.getAccessToken();
            console.log(`[ApiVideo] Step 1: Creating video container for: ${title}`);
            
            // Step 1: Create video container
            const createResponse = await axios.post(`${this.baseUrl}/videos`, {
                title: title,
                tags: ['thinkskool', 'live-session'],
                public: false,
                mp4Support: true
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const videoId = createResponse.data.videoId;
            console.log(`[ApiVideo] Video container created. ID: ${videoId}`);

            // Step 2: Upload the file to the video container
            console.log(`[ApiVideo] Step 2: Uploading file to ${videoId}/source`);
            
            const FormData = require('form-data');
            const fs = require('fs');
            
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));

            const uploadResponse = await axios.post(`${this.baseUrl}/videos/${videoId}/source`, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${token}`
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            const video = uploadResponse.data;
            console.log(`[ApiVideo] Video uploaded successfully. ID: ${video.videoId}`);
            
            await this.waitForVideoProcessing(video.videoId);

            return {
                videoId: video.videoId,
                title: video.title,
                status: video.status,
                playable: video.assets?.player,
                hls: video.assets?.hls,
                thumbnail: video.assets?.thumbnail
            };
        } catch (error) {
            console.error('[ApiVideo] Upload failed:', error.response?.data || error.message);
            throw new Error(`Video upload failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async waitForVideoProcessing(videoId, maxAttempts = 30) {
        const token = await this.getAccessToken();
        
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await axios.get(`${this.baseUrl}/videos/${videoId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.status === 'ready') {
                    return true;
                }
                console.log(`[ApiVideo] Video status: ${response.data.status}, waiting...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('[ApiVideo] Error checking video status:', error.message);
                break;
            }
        }
        return false;
    }

    async uploadVideoFromUrl(url, title) {
        if (!this.isInitialized) this.initialize();

        if (!this.apiKey) {
            throw new Error('ApiVideo API key not configured');
        }

        try {
            const token = await this.getAccessToken();
            console.log(`[ApiVideo] Uploading video from URL: ${title}`);
            
            const response = await axios.post(`${this.baseUrl}/videos`, {
                title: title,
                tags: ['thinkskool', 'live-session'],
                source: url
            }, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const video = response.data;
            console.log(`[ApiVideo] Video upload from URL initiated. ID: ${video.videoId}`);
            
            await this.waitForVideoProcessing(video.videoId);
            
            const readyResponse = await axios.get(`${this.baseUrl}/videos/${video.videoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            return {
                videoId: video.videoId,
                title: video.title,
                status: readyResponse.data.status,
                playable: readyResponse.data.assets?.player,
                hls: readyResponse.data.assets?.hls,
                thumbnail: readyResponse.data.assets?.thumbnail
            };
        } catch (error) {
            console.error('[ApiVideo] Upload from URL failed:', error.response?.data || error.message);
            throw new Error(`Video upload from URL failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async getVideo(videoId) {
        if (!this.isInitialized) this.initialize();

        if (!this.apiKey) {
            throw new Error('ApiVideo API key not configured');
        }

        try {
            const token = await this.getAccessToken();
            const response = await axios.get(`${this.baseUrl}/videos/${videoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const video = response.data;
            return {
                videoId: video.videoId,
                title: video.title,
                status: video.status,
                duration: video.metadata?.duration,
                playable: video.assets?.player,
                hls: video.assets?.hls,
                thumbnail: video.assets?.thumbnail,
                mp4: video.assets?.mp4
            };
        } catch (error) {
            console.error('[ApiVideo] Get video failed:', error.message);
            throw new Error(`Failed to get video: ${error.message}`);
        }
    }

    async deleteVideo(videoId) {
        if (!this.isInitialized) this.initialize();

        if (!this.apiKey) {
            throw new Error('ApiVideo API key not configured');
        }

        try {
            const token = await this.getAccessToken();
            await axios.delete(`${this.baseUrl}/videos/${videoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`[ApiVideo] Video deleted: ${videoId}`);
            return { success: true };
        } catch (error) {
            console.error('[ApiVideo] Delete failed:', error.message);
            throw new Error(`Failed to delete video: ${error.message}`);
        }
    }

    async listVideos() {
        if (!this.isInitialized) this.initialize();

        if (!this.apiKey) {
            throw new Error('ApiVideo API key not configured');
        }

        try {
            const token = await this.getAccessToken();
            const response = await axios.get(`${this.baseUrl}/videos`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { limit: 100, sortBy: 'createdAt', order: 'desc' }
            });

            return response.data.data.map(video => ({
                videoId: video.videoId,
                title: video.title,
                status: video.status,
                duration: video.metadata?.duration,
                createdAt: video.createdAt,
                playable: video.assets?.player,
                hls: video.assets?.hls,
                thumbnail: video.assets?.thumbnail
            }));
        } catch (error) {
            console.error('[ApiVideo] List videos failed:', error.message);
            throw new Error(`Failed to list videos: ${error.message}`);
        }
    }

    getPlayerEmbed(videoId, options = {}) {
        const {
            autoplay = true,
            muted = true,
            loop = false,
            hideTitle = true,
            hideShareButton = true,
            hideDownloadButton = true
        } = options;

        const params = new URLSearchParams({
            autoplay: autoplay ? '1' : '0',
            muted: muted ? '1' : '0',
            loop: loop ? '1' : '0',
            hideTitle: hideTitle ? '1' : '0',
            hideShareButton: hideShareButton ? '1' : '0',
            hideDownloadButton: hideDownloadButton ? '1' : '0'
        });

        return `https://embed.api.video/vod/${videoId}?${params.toString()}`;
    }
}

module.exports = new ApiVideoService();
