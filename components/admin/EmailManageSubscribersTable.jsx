import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Chip,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

export default function SubscribersManagement({
    stats,
    searchTerm,
    setSearchTerm,
    handleSearch,
    statusFilter,
    handleStatusChange,
    sourceFilter,
    handleSourceChange,
    setShowAddModal,
    handleExportCSV,
    subscribers,
    openNotesModal,
    handleToggleStatus,
    handleDeleteSubscriber,
    totalPages,
    currentPage,
    setCurrentPage,
    showAddModal,
    newSubscriber,
    setNewSubscriber,
    handleAddSubscriber,
    showNotesModal,
    selectedSubscriber,
    notesText,
    setNotesText,
    handleUpdateNotes,
    setShowNotesModal,
    handleSyncData
}) {

    return (
        <Box p={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Email Subscribers Management
            </Typography>

            {/* Stats */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="success.main">Active</Typography>
                            <Typography variant="h5" fontWeight="bold">{stats.active}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="error.main">Inactive</Typography>
                            <Typography variant="h5" fontWeight="bold">{stats.inactive}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="primary">Total Subscribers</Typography>
                            <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>



                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" color="secondary">Sources</Typography>
                            {Object.entries(stats.sources).map(([source, count]) => (
                                <Typography key={source} variant="body2">
                                    {source}: {count}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Controls */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Search */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <TextField
                                    size="small"
                                    placeholder="Search by email or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    fullWidth
                                />
                                <Button variant="contained" onClick={handleSearch}>
                                    Search
                                </Button>
                            </Box>
                        </Grid>

                        {/* Filters & Actions */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" gap={1} flexWrap="wrap" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Status"
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                    >
                                        <MenuItem value="all">All Status</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Source</InputLabel>
                                    <Select
                                        value={sourceFilter}
                                        label="Source"
                                        onChange={(e) => handleSourceChange(e.target.value)}
                                    >
                                        <MenuItem value="all">All Sources</MenuItem>
                                        <MenuItem value="registration">Registration</MenuItem>
                                        <MenuItem value="order">Order</MenuItem>
                                        <MenuItem value="manual">Manual</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button variant="contained" color="success" onClick={() => setShowAddModal(true)}>
                                    Add Subscriber
                                </Button>
                                <Button variant="contained" color="info" onClick={handleSyncData}>
                                    Sync Users
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleExportCSV}>
                                    Export CSV
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


            {/* Subscribers Table */}
            <Card>
                <CardHeader title={`Subscribers (${subscribers.length})`} />
                <CardContent>
                    {subscribers.length === 0 ? (
                        <Typography color="textSecondary">No subscribers found.</Typography>
                    ) : (
                        <TableContainer
                            sx={{
                                overflowX: 'auto',
                                maxWidth: '100vw',
                                WebkitOverflowScrolling: 'touch',
                                '&::-webkit-scrollbar': {
                                    height: '6px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '3px'
                                }
                            }}
                        >
                            <Table sx={{
                                minWidth: '800px', // Ensures table has minimum width to force horizontal scroll
                                '@media (min-width: 900px)': {
                                    minWidth: '100%' // Allows table to expand naturally on larger screens
                                }
                            }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: '200px' }}>Email</TableCell>
                                        <TableCell sx={{ minWidth: '120px' }}>Name</TableCell>
                                        <TableCell sx={{ minWidth: '120px' }}>Phone</TableCell>
                                        <TableCell sx={{ minWidth: '120px' }}>Source</TableCell>
                                        <TableCell sx={{ minWidth: '100px' }}>Status</TableCell>
                                        <TableCell sx={{ minWidth: '100px' }}>Emails Sent</TableCell>
                                        <TableCell sx={{ minWidth: '80px' }}>Clicks</TableCell>
                                        <TableCell sx={{ minWidth: '100px' }}>Notes</TableCell>
                                        <TableCell sx={{ minWidth: '180px' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subscribers.map((subscriber) => (
                                        <TableRow key={subscriber._id}>
                                            <TableCell sx={{ wordBreak: 'break-word' }}>{subscriber.email}</TableCell>
                                            <TableCell>{subscriber.name || "-"}</TableCell>
                                            <TableCell>{subscriber.phone || "-"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={subscriber.source}
                                                    color={
                                                        subscriber.source === "registration"
                                                            ? "primary"
                                                            : subscriber.source === "order"
                                                                ? "success"
                                                                : subscriber.source === "import"
                                                                    ? "info"
                                                                    : "default"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={subscriber.isActive ? "Active" : "Inactive"}
                                                    color={subscriber.isActive ? "success" : "error"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{subscriber.totalEmailsSent || 0}</TableCell>
                                            <TableCell>{subscriber.totalClicks || 0}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    onClick={() => openNotesModal(subscriber)}
                                                    sx={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {subscriber.notes ? "View/Edit" : "Add"}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={1} sx={{ flexWrap: 'nowrap' }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color={subscriber.isActive ? "error" : "success"}
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                subscriber.email,
                                                                subscriber.isActive
                                                            )
                                                        }
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                    >
                                                        {subscriber.isActive ? "Deactivate" : "Activate"}
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteSubscriber(subscriber.email)
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(e, page) => setCurrentPage(page)}
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                    }
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Add Subscriber Modal */}
            <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth>
                <DialogTitle>Add New Subscriber</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Email *"
                        value={newSubscriber.email}
                        onChange={(e) =>
                            setNewSubscriber((prev) => ({ ...prev, email: e.target.value }))
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Name"
                        value={newSubscriber.name}
                        onChange={(e) =>
                            setNewSubscriber((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Phone"
                        value={newSubscriber.phone}
                        onChange={(e) =>
                            setNewSubscriber((prev) => ({ ...prev, phone: e.target.value }))
                        }
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Source</InputLabel>
                        <Select
                            value={newSubscriber.source}
                            onChange={(e) =>
                                setNewSubscriber((prev) => ({ ...prev, source: e.target.value }))
                            }
                        >
                            <MenuItem value="manual">Manual</MenuItem>
                            <MenuItem value="registration">Registration</MenuItem>
                            <MenuItem value="order">Order</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Notes"
                        multiline
                        rows={3}
                        value={newSubscriber.notes}
                        onChange={(e) =>
                            setNewSubscriber((prev) => ({ ...prev, notes: e.target.value }))
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Tags (comma separated)"
                        value={newSubscriber.tags}
                        onChange={(e) =>
                            setNewSubscriber((prev) => ({ ...prev, tags: e.target.value }))
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Interests (comma separated)"
                        value={newSubscriber.interests}
                        onChange={(e) =>
                            setNewSubscriber((prev) => ({ ...prev, interests: e.target.value }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddSubscriber} variant="contained" color="success">
                        Add Subscriber
                    </Button>
                    <Button onClick={() => setShowAddModal(false)} variant="contained" color="inherit">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notes Modal */}
            <Dialog open={showNotesModal} onClose={() => setShowNotesModal(false)} fullWidth>
                <DialogTitle>
                    Edit Notes for {selectedSubscriber?.email}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdateNotes} variant="contained">
                        Update Notes
                    </Button>
                    <Button onClick={() => setShowNotesModal(false)} variant="contained" color="inherit">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
