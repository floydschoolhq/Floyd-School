const axios = require('axios');

class ApiVideoService {
    constructor() {
        this.apiKey = null;
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.apiKey = process.env.API_VIDEO_API_KEY;
        if (!this.apiKey) {
            console.error('[ApiVideo] ERROR: API_VIDEO_API_KEY not found in environment variables');
            return;
        }

        this.isInitialized = true;
        console.log('[ApiVideo] Client initialized successfully');
    }

    async uploadVideo(filePath, title) {
        if (!this.isInitialized) this.initialize();

        if (!this.apiKey) {
            throw new Error('ApiVideo API key not configured');
        }

        try {
            console.log(`[ApiVideo] Uploading video: ${title} from ${filePath}`);
            
            const FormData = require('form-data');
            const fs = require('fs');
            
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));
            form.append('title', title);
            form.append('tags', 'thinkskool,live-session');

            const response = await axios.post('https://api.video/videos', form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': this.apiKey
                }
            });

            const video = response.data;
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
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await axios.get(`https://api.video/videos/${videoId}`, {
                    headers: { 'Authorization': this.apiKey }
                });
                if (response.data.status === 'ready') {
                    return true;
                }
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
            console.log(`[ApiVideo] Uploading video from URL: ${title}`);
            
            const response = await axios.post('https://api.video/videos', {
                title: title,
                tags: ['thinkskool', 'live-session'],
                import_url: url
            }, {
                headers: { 'Authorization': this.apiKey }
            });

            const video = response.data;
            console.log(`[ApiVideo] Video upload from URL initiated. ID: ${video.videoId}`);
            
            await this.waitForVideoProcessing(video.videoId);
            
            const readyResponse = await axios.get(`https://api.video/videos/${video.videoId}`, {
                headers: { 'Authorization': this.apiKey }
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
            const response = await axios.get(`https://api.video/videos/${videoId}`, {
                headers: { 'Authorization': this.apiKey }
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
            await axios.delete(`https://api.video/videos/${videoId}`, {
                headers: { 'Authorization': this.apiKey }
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
            const response = await axios.get('https://api.video/videos', {
                headers: { 'Authorization': this.apiKey },
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