"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, MapPin, MapIcon, ChevronDown } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Marker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  info: string;
};

type MapStyle = {
  name: string;
  url: string;
  theme: "light" | "dark";
};

const MAP_STYLES: MapStyle[] = [
  {
    name: "Streets",
    url: "mapbox://styles/mapbox/streets-v12",
    theme: "light",
  },
  {
    name: "Outdoors",
    url: "mapbox://styles/mapbox/outdoors-v12",
    theme: "light",
  },
  { name: "Light", url: "mapbox://styles/mapbox/light-v11", theme: "light" },
  { name: "Dark", url: "mapbox://styles/mapbox/dark-v11", theme: "dark" },
  {
    name: "Satellite",
    url: "mapbox://styles/mapbox/satellite-v9",
    theme: "dark",
  },
  {
    name: "Satellite Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
    theme: "dark",
  },
  {
    name: "Navigation Day",
    url: "mapbox://styles/mapbox/navigation-day-v1",
    theme: "light",
  },
  {
    name: "Navigation Night",
    url: "mapbox://styles/mapbox/navigation-night-v1",
    theme: "dark",
  },
];

const INITIAL_MARKERS: Marker[] = [
  {
    id: "delhi",
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    info: "Capital of India",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    info: "Financial hub of India",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    info: "Tech capital of India",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    info: "Pearl city of India",
  },
  {
    id: "goa",
    name: "Goa",
    lat: 15.2993,
    lng: 73.8243,
    info: "Beach paradise",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    info: "Pink city of India",
  },
];

export default function MapsSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>(INITIAL_MARKERS);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<MapStyle>(MAP_STYLES[0]);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const filtered = useMemo(() => {
    const byName = q.trim().toLowerCase();
    if (!byName) return markers;
    return markers.filter((m) => m.name.toLowerCase().includes(byName));
  }, [q, markers]);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: currentStyle.url,
        center: [77.209, 28.6139],
        zoom: 4,
        interactive: true,
      });

      map.on("load", () => {
        setMapLoaded(true);
      });

      mapRef.current = map;

      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainer.current);

      return () => {
        resizeObserver.disconnect();
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current.clear();
        map.remove();
        mapRef.current = null;
      };
    }
  }, []);

  const handleStyleChange = (style: MapStyle) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const center = map.getCenter();
    const zoom = map.getZoom();

    map.setStyle(style.url);

    map.once("style.load", () => {
      map.setCenter(center);
      map.setZoom(zoom);
      setMapLoaded(true);
      // Re-add markers after style change
      updateMarkersAfterStyleChange();
    });

    setCurrentStyle(style);
    setShowStyleDropdown(false);

    const isDark = style.theme === "dark";
    setIsDarkTheme(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const updateMarkersAfterStyleChange = () => {
    const existingMarkers = markersRef.current;
    existingMarkers.forEach((marker) => {
      marker.remove();
    });
    existingMarkers.clear();

    // Re-add all markers
    markers.forEach((m) => {
      createMarker(m);
    });
  };

  const createMarker = (m: Marker) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const existingMarkers = markersRef.current;

    const el = document.createElement("div");
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.cursor = "pointer";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";

    const markerColor = isDarkTheme ? "#fbbf24" : "#ef4444";
    const borderColor = isDarkTheme ? "#1f2937" : "#ffffff";

    const dot = document.createElement("div");
    dot.style.width = "14px";
    dot.style.height = "14px";
    dot.style.backgroundColor = markerColor;
    dot.style.borderRadius = "50%";
    dot.style.border = `2px solid ${borderColor}`;
    dot.style.boxShadow = isDarkTheme
      ? "0 2px 8px rgba(0,0,0,0.6)"
      : "0 2px 4px rgba(0,0,0,0.3)";
    dot.style.transition = "transform 0.2s ease";

    el.appendChild(dot);

    el.addEventListener("mouseenter", () => {
      dot.style.transform = "scale(1.5)";
    });
    el.addEventListener("mouseleave", () => {
      dot.style.transform = "scale(1)";
    });
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      setActive(m);
      setPanelCollapsed(false);
      mapRef.current?.flyTo({
        center: [m.lng, m.lat],
        zoom: 12,
        duration: 1000,
      });
    });

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: "center",
    })
      .setLngLat([m.lng, m.lat])
      .addTo(map);

    existingMarkers.set(m.id, marker);
  };

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;
    const existingMarkers = markersRef.current;

    // Remove markers that are no longer in the list
    existingMarkers.forEach((marker, id) => {
      if (!markers.find((m) => m.id === id)) {
        marker.remove();
        existingMarkers.delete(id);
      }
    });

    // Add or update markers
    markers.forEach((m) => {
      const marker = existingMarkers.get(m.id);

      if (!marker) {
        createMarker(m);
      } else {
        marker.setLngLat([m.lng, m.lat]);
      }
    });
  }, [markers, mapLoaded, isDarkTheme]);

  const handleSearch = async (query: string) => {
    setQ(query);
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await res.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const newMarker: Marker = {
          id: feature.id,
          name: feature.text,
          lat: feature.center[1],
          lng: feature.center[0],
          info: feature.place_name,
        };

        setMarkers((prev) => {
          const filtered = prev.filter((m) => m.id !== newMarker.id);
          return [...filtered, newMarker];
        });

        setTimeout(() => {
          mapRef.current?.flyTo({
            center: [newMarker.lng, newMarker.lat],
            zoom: 12,
            duration: 1500,
          });
          setActive(newMarker);
          setPanelCollapsed(false);
        }, 100);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleMarkerClick = (m: Marker) => {
    setActive(m);
    setPanelCollapsed(false);
    mapRef.current?.flyTo({
      center: [m.lng, m.lat],
      zoom: 12,
      duration: 1000,
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-background">
      {/* Full Screen Map */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-sm text-muted-foreground">Loading map...</div>
        </div>
      )}

      {/* Branding - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <h1 className="font-bold text-base sm:text-lg">Geo Finder</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Explore the world
          </p>
        </div>
      </div>

      {/* Map Style Selector - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="relative">
          <Button
            onClick={() => setShowStyleDropdown(!showStyleDropdown)}
            className="bg-background/95 backdrop-blur-sm hover:bg-accent text-foreground shadow-lg gap-2"
            variant="outline"
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentStyle.name}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          {showStyleDropdown && (
            <Card className="absolute bottom-full left-0 mb-2 w-48 shadow-2xl backdrop-blur-sm bg-background/95 p-2 max-h-80 overflow-y-auto scrollbar-custom">
              <style>{`
                .scrollbar-custom::-webkit-scrollbar {
                  width: 8px;
                }
                .scrollbar-custom::-webkit-scrollbar-track {
                  background: transparent;
                }
                .scrollbar-custom::-webkit-scrollbar-thumb {
                  background: hsl(var(--color-muted-foreground) / 0.5);
                  border-radius: 4px;
                }
                .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                  background: hsl(var(--color-muted-foreground) / 0.7);
                }
              `}</style>
              <div className="space-y-1">
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.url}
                    onClick={() => handleStyleChange(style)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentStyle.url === style.url
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <div
        className={`absolute top-4 right-4 z-20 transition-all duration-300 ${
          panelCollapsed ? "translate-x-[calc(100%+1rem)]" : "translate-x-0"
        }`}
      >
        <Card className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 py-0 shadow-2xl backdrop-blur-sm bg-background/95 max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          {/* Search Section */}
          <div className="p-3 sm:p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="font-semibold text-base sm:text-lg truncate">
                Search & Explore
              </h3>
              <button
                onClick={() => setPanelCollapsed(!panelCollapsed)}
                className="p-1 hover:bg-accent rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background/50">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search location..."
                value={q}
                onChange={(e) => handleSearch(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 h-auto py-0 text-sm"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="flex-shrink-0 p-1 hover:bg-accent rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Matches Section */}
            <div className="p-3 sm:p-4 border-b">
              <div className="text-xs font-medium text-muted-foreground mb-3">
                Locations ({filtered.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {filtered.length > 0 ? (
                  filtered.map((m) => (
                    <Badge
                      key={m.id}
                      variant={active?.id === m.id ? "default" : "secondary"}
                      className="cursor-pointer hover:opacity-80 transition-opacity text-xs px-3 py-1"
                      onClick={() => handleMarkerClick(m)}
                    >
                      {m.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No matches found
                  </p>
                )}
              </div>
            </div>

            {/* Selected Location */}
            <div className="p-3 sm:p-4">
              <div className="text-xs font-medium text-muted-foreground mb-3">
                Selected Location
              </div>
              {active ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base mb-1 break-words">
                        {active.name}
                      </div>
                      <div className="text-sm text-muted-foreground break-words">
                        {active.info}
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Latitude:</span>
                        <div className="font-mono mt-1 break-all">
                          {active.lat.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Longitude:
                        </span>
                        <div className="font-mono mt-1 break-all">
                          {active.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic text-center py-8">
                  Click a marker on the map to view details
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Collapsed Panel Toggle Button */}
      {panelCollapsed && (
        <button
          onClick={() => setPanelCollapsed(false)}
          className="absolute top-4 right-4 z-20 p-3 bg-background/95 backdrop-blur-sm rounded-lg shadow-2xl hover:bg-accent transition-colors"
        >
          <MapPin className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
