import React from 'react'
import './index.scss'
function Index() {
    return (
        <div class="container">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                <div className='example-containe' class="col">Column</div>
                <div class="col">Column</div>
                <div class="col">Column</div>
                <div class="col">Column</div>
            </div>
        </div>
    )
}

export default Index
