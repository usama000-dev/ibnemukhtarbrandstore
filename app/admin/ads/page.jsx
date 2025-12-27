"use client";
import React, { useState, useEffect } from 'react';
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import BaseCard from "../(DashboardLayout)/components/shared/BaseCard";
import VideoUploader from "@/components/atom/VideoUploader";
import {
    Box, Button, Container, Grid, Stack, TextField, Typography, Select, MenuItem, InputLabel, FormControl,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Switch, Tabs, Tab
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";

const MainWrapper = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
}));

const PageWrapper = styled("div")(() => ({
    display: "flex",
    flexGrow: 1,
    paddingBottom: "60px",
    flexDirection: "column",
    zIndex: 1,
    backgroundColor: "transparent",
}));

const AdsPage = () => {
    const [tabIndex, setTabIndex] = useState(0);

    // Ads State
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adForm, setAdForm] = useState({
        title: '',
        ctaText: 'Shop Now',
        ctaLink: '',
        ctaType: 'link',
        videoUrl: ''
    });
    const [uploadedAdVideo, setUploadedAdVideo] = useState([]);

    // Posts State
    const [postForm, setPostForm] = useState({
        title: '',
        description: '',
        type: 'video', // video, image, poll
        category: 'other',
        url: '', // Video URL
        pollQuestion: '',
        pollOptions: ['', '']
    });
    const [uploadedPostMedia, setUploadedPostMedia] = useState([]);

    // Moderation State
    const [pendingPosts, setPendingPosts] = useState([]);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/ads');
            const data = await res.json();
            if (data.success) {
                setAds(data.ads);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPending = async () => {
        try {
            const res = await fetch('/api/stream/feed?status=pending_approval&limit=50&category=all');
            const data = await res.json();
            if (data.success) {
                setPendingPosts(data.videos);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAds();
        fetchPending();
    }, []);

    // --- ADS HANDLERS ---
    const handleAdChange = (e) => {
        setAdForm({ ...adForm, [e.target.name]: e.target.value });
    };

    const handleAdSubmit = async (e) => {
        e.preventDefault();
        if (uploadedAdVideo.length === 0 || uploadedAdVideo[0].status !== 'success') {
            toast.error("Please upload a video first");
            return;
        }

        const payload = {
            ...adForm,
            videoUrl: uploadedAdVideo[0].url
        };

        try {
            const res = await fetch('/api/admin/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Ad Created Successfully');
                setAdForm({ title: '', ctaText: 'Shop Now', ctaLink: '', ctaType: 'link', videoUrl: '' });
                setUploadedAdVideo([]);
                fetchAds();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to create ad");
        }
    };

    const handleDeleteAd = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Ad deleted");
                fetchAds();
            }
        } catch (error) {
            toast.error("Error deleting ad");
        }
    };

    const toggleAdStatus = async (ad) => {
        const newStatus = ad.status === 'active' ? 'inactive' : 'active';
        try {
            await fetch('/api/admin/ads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: ad._id, status: newStatus })
            });
            fetchAds();
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    // --- POST HANDLERS ---
    const handlePostChange = (e) => {
        setPostForm({ ...postForm, [e.target.name]: e.target.value });
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...postForm, source: 'upload', status: 'active' };

        if (postForm.type === 'video') {
            if (uploadedPostMedia.length === 0) {
                toast.error("Please upload a video");
                return;
            }
            payload.url = uploadedPostMedia[0].url;
            payload.platformId = uploadedPostMedia[0].id;
        } else if (postForm.type === 'image') {
            if (uploadedPostMedia.length === 0) {
                toast.error("Please upload images");
                return;
            }
            payload.media = uploadedPostMedia.map(m => ({ type: 'image', url: m.url }));
            payload.url = uploadedPostMedia[0].url; // Main thumbnail
            payload.platformId = 'img_' + Date.now();
        } else if (postForm.type === 'poll') {
            payload.poll = {
                question: postForm.pollQuestion,
                options: postForm.pollOptions.filter(o => o.trim() !== '').map(text => ({ text, votes: 0 })),
                totalVotes: 0
            };
            payload.url = '#'; // Dummy
            payload.platformId = 'poll_' + Date.now();
        }

        try {
            const res = await fetch('/api/stream/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Post Created Successfully');
                setPostForm({
                    title: '', description: '', type: 'video', category: 'other', url: '',
                    pollQuestion: '', pollOptions: ['', '']
                });
                setUploadedPostMedia([]);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to create post");
        }
    };

    // --- MODERATION HANDLERS ---
    const handleApprove = async (id) => {
        try {
            const res = await fetch('/api/stream/post', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'active' })
            });
            if (res.ok) {
                toast.success("Post Approved!");
                fetchPending();
            }
        } catch (e) { toast.error("Failed to approve"); }
    };

    const handleReject = async (id) => {
        if (!confirm("Reject this post?")) return;
        try {
            const res = await fetch('/api/stream/post', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'rejected' })
            });
            if (res.ok) {
                toast.info("Post Rejected");
                fetchPending();
            }
        } catch (e) { toast.error("Failed to reject"); }
    };

    return (
        <MainWrapper>
            <ToastContainer position="bottom-left" autoClose={1000} />
            <div className="admin-sidebar">
                <Sidebar />
            </div>
            <PageWrapper className="page-wrapper">
                <Header />
                <Container maxWidth="lg" sx={{ paddingTop: "20px" }}>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} aria-label="admin tabs">
                            <Tab label="Manage Ads" />
                            <Tab label="Create Post" />
                            <Tab label={`Moderation Queue (${pendingPosts.length})`} sx={{ fontWeight: 'bold', color: pendingPosts.length > 0 ? 'red' : 'inherit' }} />
                        </Tabs>
                    </Box>

                    {/* TAB 0: ADS */}
                    {tabIndex === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={6}>
                                <BaseCard title="Create New Ad">
                                    <form onSubmit={handleAdSubmit}>
                                        <Stack spacing={3}>
                                            <TextField name="title" label="Ad Title" value={adForm.title} onChange={handleAdChange} required fullWidth />
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <TextField name="ctaText" label="Button Text" value={adForm.ctaText} onChange={handleAdChange} fullWidth />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Action Type</InputLabel>
                                                        <Select name="ctaType" value={adForm.ctaType} label="Action Type" onChange={handleAdChange}>
                                                            <MenuItem value="link">Website Link</MenuItem>
                                                            <MenuItem value="call">Phone Call</MenuItem>
                                                            <MenuItem value="whatsapp">WhatsApp</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <TextField name="ctaLink" label="Destination Link / Phone Number" value={adForm.ctaLink} onChange={handleAdChange} required fullWidth helperText="For calls/whatsapp, enter number with country code (e.g., +92316...)" />

                                            <VideoUploader
                                                maxVideos={1}
                                                onChange={setUploadedAdVideo}
                                                folder="ads"
                                                acceptType="video/*"
                                            />

                                            <Button type="submit" variant="contained" color="primary" size="large">Create Ad</Button>
                                        </Stack>
                                    </form>
                                </BaseCard>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                {/* AD PREVIEW */}
                                <BaseCard title="Ad Preview">
                                    <Box sx={{ width: '100%', height: '500px', bgcolor: 'black', borderRadius: 2, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {uploadedAdVideo.length > 0 ? (
                                            <video src={uploadedAdVideo[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay loop muted playsInline />
                                        ) : (
                                            <Typography color="white">Upload video to preview</Typography>
                                        )}
                                        {/* Overlay Preview */}
                                        <Box sx={{ position: 'absolute', bottom: 20, left: 0, width: '100%', p: 2 }}>
                                            <Chip label="Sponsored" color="warning" size="small" sx={{ mb: 1 }} />
                                            <Typography variant="h6" color="white" fontWeight="bold">{adForm.title || 'Ad Title'}</Typography>
                                            <Button variant="contained" color="warning" sx={{ mt: 2, borderRadius: 50, fontWeight: 'bold' }}>
                                                {adForm.ctaText}
                                            </Button>
                                        </Box>
                                    </Box>
                                </BaseCard>
                            </Grid>

                            <Grid item xs={12} lg={12}>
                                <BaseCard title="Active Ads">
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Video</TableCell>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>Views</TableCell>
                                                    <TableCell>Clicks</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {ads.map((ad) => (
                                                    <TableRow key={ad._id}>
                                                        <TableCell>
                                                            <video src={ad.videoUrl} style={{ width: 60, borderRadius: 4 }} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle2" fontWeight={600}>{ad.title}</Typography>
                                                            <Typography variant="caption">{ad.ctaText}</Typography>
                                                        </TableCell>
                                                        <TableCell>{ad.views || 0}</TableCell>
                                                        <TableCell>{ad.clicks || 0}</TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={ad.status === 'active'}
                                                                onChange={() => toggleAdStatus(ad)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button color="error" onClick={() => handleDeleteAd(ad._id)}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {ads.length === 0 && !loading && (
                                                    <TableRow><TableCell colSpan={6} align="center">No ads found</TableCell></TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </BaseCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* TAB 1: CREATE POST */}
                    {tabIndex === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={6}>
                                <BaseCard title="Create New Post">
                                    <form onSubmit={handlePostSubmit}>
                                        <Stack spacing={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Post Type</InputLabel>
                                                <Select name="type" value={postForm.type} label="Post Type" onChange={handlePostChange}>
                                                    <MenuItem value="video">Video</MenuItem>
                                                    <MenuItem value="image">Image Carousel</MenuItem>
                                                    <MenuItem value="poll">Poll</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <TextField name="title" label="Caption / Title" value={postForm.title} onChange={handlePostChange} multiline rows={2} required fullWidth />

                                            {/* TYPE: VIDEO */}
                                            {postForm.type === 'video' && (
                                                <VideoUploader
                                                    maxVideos={1}
                                                    onChange={setUploadedPostMedia}
                                                    folder="stream"
                                                    acceptType="video/*"
                                                />
                                            )}

                                            {/* TYPE: IMAGE */}
                                            {postForm.type === 'image' && (
                                                <VideoUploader
                                                    maxVideos={5}
                                                    onChange={setUploadedPostMedia}
                                                    folder="stream-images"
                                                    acceptType="image/*"
                                                />
                                            )}

                                            {/* TYPE: POLL */}
                                            {postForm.type === 'poll' && (
                                                <Stack spacing={2}>
                                                    <TextField name="pollQuestion" label="Question" value={postForm.pollQuestion} onChange={handlePostChange} fullWidth />
                                                    {postForm.pollOptions.map((opt, i) => (
                                                        <TextField
                                                            key={i}
                                                            label={`Option ${i + 1}`}
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newOpts = [...postForm.pollOptions];
                                                                newOpts[i] = e.target.value;
                                                                setPostForm({ ...postForm, pollOptions: newOpts });
                                                            }}
                                                            fullWidth
                                                        />
                                                    ))}
                                                    <Button onClick={() => setPostForm({ ...postForm, pollOptions: [...postForm.pollOptions, ''] })}>+ Add Option</Button>
                                                </Stack>
                                            )}

                                            <Button type="submit" variant="contained" color="secondary" size="large">Publish Post</Button>
                                        </Stack>
                                    </form>
                                </BaseCard>
                            </Grid>

                            {/* PREVIEW */}
                            <Grid item xs={12} lg={6}>
                                <BaseCard title="Post Preview">
                                    <Box sx={{ width: '100%', height: '500px', bgcolor: 'black', borderRadius: 2, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {postForm.type === 'video' && uploadedPostMedia.length > 0 ? (
                                            <video src={uploadedPostMedia[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay loop muted playsInline />
                                        ) : postForm.type === 'image' && uploadedPostMedia.length > 0 ? (
                                            <img src={uploadedPostMedia[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : postForm.type === 'poll' ? (
                                            <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: '80%' }}>
                                                <Typography variant="h6" fontWeight="bold" mb={2}>{postForm.pollQuestion || 'Question?'}</Typography>
                                                <Stack spacing={1}>
                                                    {postForm.pollOptions.map((opt, i) => (
                                                        <Box key={i} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>{opt || `Option ${i + 1}`}</Box>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        ) : (
                                            <Typography color="white">Preview will appear here</Typography>
                                        )}

                                        {/* Overlay Caption */}
                                        <Box sx={{ position: 'absolute', bottom: 20, left: 0, width: '100%', p: 2 }}>
                                            <Typography variant="body1" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{postForm.title}</Typography>
                                        </Box>
                                    </Box>
                                </BaseCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* TAB 2: MODERATION QUEUE */}
                    {tabIndex === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <BaseCard title="Moderation Queue (Pending Approval)">
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Preview</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>User</TableCell>
                                                    <TableCell>Content</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pendingPosts.map((post) => (
                                                    <TableRow key={post._id}>
                                                        <TableCell>
                                                            {post.type === 'video' ? <video src={post.url} style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 4 }} />
                                                                : post.type === 'image' ? <img src={post.url} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                                                                    : <Box sx={{ width: 80, height: 80, bgcolor: 'blue', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>POLL</Box>}
                                                        </TableCell>
                                                        <TableCell>{post.type}</TableCell>
                                                        <TableCell>{post.user?.name || 'Anonymous'}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="subtitle2" fontWeight="bold">{post.title}</Typography>
                                                            <Typography variant="caption">{post.description}</Typography>
                                                        </TableCell>
                                                        <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Stack direction="row" spacing={1}>
                                                                <Button variant="contained" color="success" size="small" onClick={() => handleApprove(post._id)}>Approve</Button>
                                                                <Button variant="outlined" color="error" size="small" onClick={() => handleReject(post._id)}>Reject</Button>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {pendingPosts.length === 0 && (
                                                    <TableRow><TableCell colSpan={6} align="center">No pending posts! 🎉</TableCell></TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </BaseCard>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </PageWrapper>
        </MainWrapper>
    );
};

export default AdsPage;
