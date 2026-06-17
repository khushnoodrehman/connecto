import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useFriend } from '../../../providers/FriendContext.jsx';

const ProfileCard = ({ user, type, requestId }) => {
    const { acceptFriendRequest, declineFriendRequest, sendFriendRequest, setSuggestions } = useFriend();

    if (!user) return null;

    const handleAction = async (actionType) => {
        if (actionType === 'accept') {
            await acceptFriendRequest(requestId);
        } else if (actionType === 'decline') {
            await declineFriendRequest(requestId);
        } else if (actionType === 'send') {
            await sendFriendRequest(user._id);
        } else if (actionType === 'hide') {
            setSuggestions((prev) => prev.filter((s) => s._id !== user._id));
        }
    };

    return (
        <Card style={{ width: '16rem', margin: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <Link to={`/profile/${user._id}`}>
                <Card.Img 
                    variant="top" 
                    style={{ height: '220px', objectFit: "cover", cursor: 'pointer' }} 
                    src={user.avatar || "https://via.placeholder.com/220"} 
                />
            </Link>
            <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: '130px' }}>
                <div>
                    <Link to={`/profile/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card.Title style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 5px 0', cursor: 'pointer' }}>
                            {user.name}
                        </Card.Title>
                    </Link>
                    {user.bio && (
                        <Card.Text style={{ fontSize: '0.85rem', color: '#65676b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
                            {user.bio}
                        </Card.Text>
                    )}
                </div>
                <div className="d-flex flex-column gap-2 mt-3">
                    {type === 'request' ? (
                        <>
                            <Button variant="primary" size="sm" onClick={() => handleAction('accept')} style={{ fontWeight: '600' }}>
                                Confirm
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleAction('decline')} style={{ fontWeight: '600', backgroundColor: '#e4e6eb', border: 'none', color: '#050505' }}>
                                Delete
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" size="sm" onClick={() => handleAction('send')} style={{ fontWeight: '600' }}>
                                Add Friend
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleAction('hide')} style={{ fontWeight: '600', backgroundColor: '#e4e6eb', border: 'none', color: '#050505' }}>
                                Remove
                            </Button>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProfileCard;