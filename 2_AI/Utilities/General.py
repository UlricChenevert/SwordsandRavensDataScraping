def combineTextFragments(segment):
    """Combines retrieved rule chunks into one clean string."""
    return "\n\n".join(doc.page_content for doc in segment)