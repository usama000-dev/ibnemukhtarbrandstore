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

// ... styles ...
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
    const [ads, setAds] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]); // Moderation Queue
    const [loading, setLoading] = useState(true);

    // Form States (Ad & Post) ...
    const [adForm, setAdForm] = useState({ title: '', ctaText: 'Shop Now', ctaLink: '', ctaType: 'link', videoUrl: '' });
    const [uploadedAdVideo, setUploadedAdVideo] = useState([]);
    const [postForm, setPostForm] = useState({ title: '', description: '', type: 'video', category: 'other', url: '', pollQuestion: '', pollOptions: ['', ''] });
    const [uploadedPostMedia, setUploadedPostMedia] = useState([]);

    const fetchAds = async () => { /* ... existing ... */ };

    // FETCH PENDING POSTS
    const fetchPendingPosts = async () => {
        try {
            const res = await fetch('/api/stream/feed?status=pending_approval&limit=50'); // Need to update feed API to support status filter or create admin endpoint
            // Since Feed API defaults to active, let's assume we update it or use a raw fetch. 
            // Actually, `feed` api defaults to `active`. Need to update `feed/route.ts` to allow filtering IF admin?
            // Safer: Create a specific admin/moderation endpoint OR just use `feed` with query param if it supports it.
            // Previous Check: Feed API `const query: any = { status: 'active' };` -> It HARDCODES active.
            // I need to update Feed API to support status param OR create a new API.
            // I'll create a new function here that repurposes `GET /api/stream/feed` logic but requesting `pending_approval`.
            // Wait, I can't change the API from here. I need to update `feed/route.ts` first to accept `status` param.

            // Temporary Workaround: Fetch ALL and filter? No, Feed API filters `active`.
            // I MUST update `feed/route.ts` to allow status override.
        } catch (e) { console.error(e); }
    };

    // ... rest of component ...
}
// I will rewrite this file completely in the next tool call properly.
// This `write_to_file` call is just a placeholder to signal intent, but I need to `replace_file_content` for `feed/route.ts` first.
// Actually, I should update `feed/route.ts` NOW before writing the full Admin Page.
