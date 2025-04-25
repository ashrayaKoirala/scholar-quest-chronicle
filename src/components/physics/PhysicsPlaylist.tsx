
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PlaylistInfo {
  title: string;
  url: string;
  embedId?: string;
}

const PLAYLISTS: PlaylistInfo[] = [
  {
    title: "Mechanics & Materials",
    url: "https://www.youtube.com/watch?v=UsPzXTdrILE&list=PLEs_zKbA7sG-bnQ8JPUBjQyL1nZZt3qya",
    embedId: "PLEs_zKbA7sG-bnQ8JPUBjQyL1nZZt3qya"
  },
  {
    title: "Waves & Optics",
    url: "https://www.youtube.com/watch?v=HeOn6U2sxh4&list=PLEs_zKbA7sG_96QA21LgcmxnDudg21w9D",
    embedId: "PLEs_zKbA7sG_96QA21LgcmxnDudg21w9D"
  },
  {
    title: "Particle Physics",
    url: "https://www.youtube.com/watch?v=OeUr7kEzgoY&list=PLEs_zKbA7sG_veBRFzJayo8hAJYLg0JJw",
    embedId: "PLEs_zKbA7sG_veBRFzJayo8hAJYLg0JJw"
  }
];

export default function PhysicsPlaylist() {
  const [activePlaylist, setActivePlaylist] = useState<string>(PLAYLISTS[0].embedId || '');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  
  // Load minimized state from local storage
  useEffect(() => {
    const savedState = localStorage.getItem('physics-playlist-minimized');
    if (savedState !== null) {
      setIsMinimized(savedState === 'true');
    }
    
    const savedPlaylist = localStorage.getItem('physics-playlist-active');
    if (savedPlaylist) {
      setActivePlaylist(savedPlaylist);
    }
  }, []);
  
  // Save minimized state to local storage
  useEffect(() => {
    localStorage.setItem('physics-playlist-minimized', String(isMinimized));
  }, [isMinimized]);
  
  // Save active playlist to local storage
  useEffect(() => {
    localStorage.setItem('physics-playlist-active', activePlaylist);
  }, [activePlaylist]);
  
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handlePlaylistChange = (playlistId: string) => {
    setActivePlaylist(playlistId);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-10">
        <Button 
          onClick={toggleMinimized}
          className="shadow-lg bg-primary text-white hover:bg-primary/90"
        >
          Show Physics Videos
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${isMinimized ? 'hidden' : 'relative'} max-w-3xl mx-auto`}>
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={toggleMinimized}
        className="absolute top-2 right-2 z-10"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader className="pb-3">
        <CardTitle>Physics Video Resources</CardTitle>
        <CardDescription>
          Watch curated videos to help with your studies
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          value={activePlaylist} 
          onValueChange={handlePlaylistChange}
          className="w-full"
        >
          <TabsList className="mb-4">
            {PLAYLISTS.map(playlist => (
              <TabsTrigger 
                key={playlist.embedId} 
                value={playlist.embedId || ''}
              >
                {playlist.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {PLAYLISTS.map(playlist => (
            <TabsContent 
              key={playlist.embedId} 
              value={playlist.embedId || ''}
              className="aspect-video"
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/videoseries?list=${playlist.embedId}`}
                title={`${playlist.title} Playlist`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
