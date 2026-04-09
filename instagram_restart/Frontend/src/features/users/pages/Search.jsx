import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, XCircle } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import debounce from 'lodash/debounce';
import SearchUserTile from '../components/SearchUserTile';
import styles from './Search.module.scss';

const Search = () => {
    const [ query, setQuery ] = useState('');
    const [ results, setResults ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const { handleSearchUser } = useUser()


    async function fetchSearchUserData(query) {
        setLoading(true)
        try {
            const users = await handleSearchUser({ query })
            setResults(users)
        } catch (error) {
            console.error('Search error:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useMemo(
        () => debounce((query) => {
            return fetchSearchUserData(query)
        }, 500),
        []
    );

    useEffect(() => {
        if (!query) {
            return
        }
        debouncedSearch(query)
    }, [ query ])

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchWrap}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Search</h1>

                    {/* Search Bar */}
                    <div className={styles.searchBar}>
                        <SearchIcon size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users..."
                            className={styles.searchInput}
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className={styles.clearBtn}>
                                <XCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results List */}
                <div className={styles.resultsList}>
                    {loading && (
                        <div className={styles.loaderWrap}>
                            <div className={styles.spinner}></div>
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className={styles.noResults}>
                            No results found for "{query}"
                        </div>
                    )}

                    {!loading && results.map((user) => <SearchUserTile key={user._id} user={user} />)}

                    {!query && !loading && (
                        <div className={styles.emptyState}>
                            <SearchIcon size={48} className={styles.emptyIcon} />
                            <p className={styles.emptyText}>Search for curators, artists, and friends</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;